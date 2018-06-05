//
//  MXUpgradeTask.m
//  MxBrowser-iPhone
//
//  Created by LiuCharles on 18/01/2018.
//  Copyright © 2018 www.maxthon.com. All rights reserved.
//

#import "MXUpgradeTask.h"
#import "LVConfiguration.h"

@import AFNetworking;

static NSString * const kMXEnterpriseBundleIdentifier  = @"com.livesone.wallet";
static NSString * const kMXEnterpriseClientManifestUrl = @"https://down-lives-one.oss-cn-beijing.aliyuncs.com/download/wallet/manifest.plist";
static NSString * kMXEnterpriseClientInstallationURL;

static NSString * const kMXLastCheckTimeKey            = @"kLastCheckTimeKey";
static const long long kMXCheckDuration                = 60 * 5 * 1000;
static const NSTimeInterval kTimerInterval             = 60 * 3;

@interface MXUpgradeTask ()
@property (strong, nonatomic) MXUpgradeTask *dependencyTask;
@end

@implementation MXUpgradeTask

- (instancetype)initWithDependencyTask:(MXUpgradeTask *)dependencyTask {
    if(self = [super init]) {
        _dependencyTask = dependencyTask;
    }
    return self;
}

- (BOOL)execute {
    if(self.dependencyTask && ![self.dependencyTask execute]) {
        return NO;
    }
    return YES;
}

@end

@interface MXAppUpgradeTask ()
@property (assign, nonatomic) BOOL updateChecked;
@property (strong, nonatomic) NSTimer *timer;
@property (assign, nonatomic) BOOL checking;
@property (assign, nonatomic) BOOL isUpdateConfig;

@end

@implementation MXAppUpgradeTask

+ (void)initialize {
    kMXEnterpriseClientInstallationURL = [NSString stringWithFormat:@"itms-services://?action=download-manifest&url=%@",[[self new] mx_EnterpriseClientManifestUrl]];
}

- (instancetype)init{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(onConfigUpdateHandle) name:LVEnterpriseClientManifestURLUpdateNotification
                                                   object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self
                                               selector:@selector(onApplicationDidBecomeAtive) name:UIApplicationDidBecomeActiveNotification
                                                 object:nil];
    }
    return self;
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)onApplicationDidBecomeAtive {
    [self execute];
}

//timer will only be used under jailbroken envrionment.
- (void)onTimerTick {
    [self execute];
}

// MXConfigUpdate
- (void)onConfigUpdateHandle {
    self.isUpdateConfig = YES;
    self.checking = NO;
    [self execute];
}

- (BOOL)execute {
    if(![super execute] || self.checking) {
        return NO;
    }
    
    self.checking = YES;
    
    if (!self.isUpdateConfig) {
        return NO;
    }
    BOOL checked = self.updateChecked;
    NSNumber *storedTime = [[NSUserDefaults standardUserDefaults] objectForKey:kMXLastCheckTimeKey];
    if(checked && storedTime) {
        long long past = [storedTime longLongValue];
        long long current = [[self currentTimeSince1970] longLongValue];
        
        if(current - past > kMXCheckDuration) {
            checked = NO;
        }
    }
    
    if(checked) {
        self.checking = NO;
        return YES;
    }
    
    __weak typeof(self) weakSelf = self;
    [self checkIfUpgradeNeededWithCompletionBlock:^{
        __strong typeof(weakSelf) strongSelf = weakSelf;
        [[NSUserDefaults standardUserDefaults] setObject:[self currentTimeSince1970] forKey:kMXLastCheckTimeKey];
        strongSelf.updateChecked = YES;
        strongSelf.checking = NO;
    }];
    return YES;
}

- (NSNumber *)currentTimeSince1970
{
  NSTimeInterval currentDate = [[NSDate date] timeIntervalSince1970] * 1000.0;
  return [NSNumber numberWithLongLong:(long long)currentDate];
}

- (void)checkIfUpgradeNeededWithCompletionBlock:(void (^)(void))completionBlock {
    [self enterpriseClientCheckForUpdateImmediately:^(BOOL needUpdate, NSString *value) {
        if(needUpdate) {
            NSString *message = NSLocalizedString(@"new_app_version_detected_msg", nil);
        
            UIAlertController *alertController = [UIAlertController alertControllerWithTitle:NSLocalizedString(@"new_app_version_detected", nil) message:message preferredStyle:UIAlertControllerStyleAlert];
          
            [alertController addAction:[UIAlertAction actionWithTitle:NSLocalizedString(@"upgrade_next_time", nil) style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            }]];
          
            [alertController addAction:[UIAlertAction actionWithTitle:NSLocalizedString(@"upgrade_now", nil) style:UIAlertActionStyleCancel handler:^(UIAlertAction *action) {
                [[UIApplication sharedApplication] openURL:[NSURL URLWithString:kMXEnterpriseClientInstallationURL]];
            }]];
            
            [[[UIApplication sharedApplication].keyWindow rootViewController] presentViewController:alertController animated:YES completion:^ {
                if(completionBlock){
                    completionBlock();
                }
            }];
        } else {
            if(completionBlock){
                completionBlock();
            }
        }
    }];
}

- (void)enterpriseClientCheckForUpdateImmediately:(void (^)(BOOL, NSString *))callback {
    [self downloadEnterpriseClientMainfest:^(NSDictionary *mainfest) {
        if (callback) {
            if (mainfest) {
                NSDictionary *firstObject = [mainfest[@"items"] firstObject];
                NSDictionary *metadata  = firstObject[@"metadata"];
                
                NSString *version = metadata[@"bundle-version"];
                NSString *curVersion = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
                
                dispatch_async(dispatch_get_main_queue(), ^{
                    if ([curVersion compare:version options:NSNumericSearch] == NSOrderedAscending) {
                        callback(YES, version);
                    } else {
                        callback(NO, version);
                    }
                });
            } else {
                dispatch_async(dispatch_get_main_queue(), ^{
                    callback(NO, nil);
                });
            }
        }
    }];

}

- (void)downloadEnterpriseClientMainfest:(void (^)(NSDictionary *mainfest))completionHandler {
    NSURLSessionConfiguration * config = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:config];
    
    NSURL *mainfeastURL = [NSURL URLWithString:[self mx_EnterpriseClientManifestUrl]];
    
    NSURLSessionDownloadTask *downloadTask = [session downloadTaskWithURL:mainfeastURL completionHandler:^(NSURL *location, NSURLResponse *response, NSError *error) {
        
        NSInteger statusCode = [(NSHTTPURLResponse *)response statusCode];
        NSInteger firstCode = [[[@(statusCode) stringValue] substringToIndex:1] integerValue];
        
        if (completionHandler) {
            if (firstCode == 4 || firstCode == 5) {
                completionHandler(nil);
            }
            else if (!error) {
                NSDictionary *content = [NSDictionary dictionaryWithContentsOfURL:location];
                completionHandler(content);
            }
            else {
                completionHandler(nil);
            }
        }
    }];
    
    [downloadTask resume];
}

- (NSString *)mx_EnterpriseClientManifestUrl{
    NSString *url = LVConfiguration.enterpriseClientManifestURL;
    if (!url || url.length == 0) {
        return kMXEnterpriseClientManifestUrl;
    }
    return url;
}

@end
