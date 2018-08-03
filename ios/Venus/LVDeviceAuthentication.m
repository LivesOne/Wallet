//
//  LVDeviceAuthentication.m
//  Venus
//
//  Created by XiaoLei Tian on 2018/7/20.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "LVDeviceAuthentication.h"
#import <LocalAuthentication/LocalAuthentication.h>

#define isIphoneX (CGSizeEqualToSize(CGSizeMake(375.f, 812.f), [UIScreen mainScreen].bounds.size) || CGSizeEqualToSize(CGSizeMake(812.f, 375.f), [UIScreen mainScreen].bounds.size))

@interface LVDeviceAuthentication ()

@property (strong, nonatomic, readonly) LAContext *contex;

@end

@implementation LVDeviceAuthentication

static LVDeviceAuthentication *sharedInstance = nil;

+ (instancetype)sharedInstance {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[LVDeviceAuthentication alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        _contex = [[LAContext alloc] init];
    }
    return self;
}

+ (BOOL)isDeviceAuthTypeAvailable:(LVDeviceAuthType)type
{
    if (LVDeviceAuthTypePassword == type) {
        return YES;
    }
    
    NSError *error = nil;
    LAContext *contex = [LVDeviceAuthentication sharedInstance].contex;
    BOOL canEvaluatePolicy = [contex canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error];
    
    if (nil == error && canEvaluatePolicy) {
        if (@available(iOS 11.0, *)) {
            switch (contex.biometryType) {
                case LABiometryTypeNone:
                    return NO;
                case LABiometryTypeTouchID:
                    return LVDeviceAuthTypeTouchID == type;
                case LABiometryTypeFaceID:
                    return LVDeviceAuthTypeFaceID == type;
                default:
                    break;
            }
        } else {
            return LVDeviceAuthTypeTouchID == type;
        }
    }
    
    return NO;
}

static NSString * const kAUTH_ERROR_SWITCH = @"1"; // 超出错误次数，切换验证方式
static NSString * const kAUTH_ERROR_RETRY = @"2"; // 发生不匹配错误，点击重试

+ (void)evaluatePolicyWith:(void (^)(BOOL, NSString * __nullable, NSString * __nullable))callback
{
    LAContext *contex = [LVDeviceAuthentication sharedInstance].contex;
    NSString  *reason = NSLocalizedString(@"need_auth_into_wallet", nil);
    [contex evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics localizedReason:reason reply:^(BOOL success, NSError * _Nullable error) {
        if (success) {
            callback(YES, nil, nil);
        } else {
            if (error.code == kLAErrorUserFallback || error.code == kLAErrorBiometryLockout) {
                callback(NO, kAUTH_ERROR_SWITCH, error.localizedDescription);
            }
            else if (error.code == kLAErrorPasscodeNotSet
                     || error.code == kLAErrorBiometryNotAvailable
                     || error.code == kLAErrorBiometryNotEnrolled) {
                [self showAlertWithError:error];
                callback(NO, [@(error.code) stringValue], error.localizedDescription);
            }
            else {
                callback(NO, [@(error.code) stringValue], error.localizedDescription);
            }
        }
    }];
}

+ (void)showAlertWithError:(NSError *)error {
    NSString *alertMessage = nil;
    NSString *alertTitle = @"";
    
    if (isIphoneX) {
        alertTitle = NSLocalizedString(@"face_id", nil);
        
        if (error.code == kLAErrorPasscodeNotSet) {
            alertMessage = NSLocalizedString(@"face_id_passcode_not_set", nil);
        }
        else if (error.code == kLAErrorBiometryNotAvailable) {
            alertMessage = NSLocalizedString(@"face_id_not_available", nil);
        }
        else if (error.code == kLAErrorBiometryNotEnrolled) {
            alertMessage = NSLocalizedString(@"face_id_not_enrolled", nil);
        }
        
    } else {
        alertTitle = NSLocalizedString(@"touch_id", nil);
        
        if (error.code == kLAErrorPasscodeNotSet) {
            alertMessage = NSLocalizedString(@"touch_id_passcode_not_set", nil);
        }
        else if (error.code == kLAErrorBiometryNotAvailable) {
            alertMessage = NSLocalizedString(@"touch_id_not_available", nil);
        }
        else if (error.code == kLAErrorBiometryNotEnrolled) {
            alertMessage = NSLocalizedString(@"touch_id_not_enrolled", nil);
        }
    }
    
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:alertTitle
                                                                   message:alertMessage
                                                            preferredStyle:UIAlertControllerStyleAlert];
    
    [alert addAction:[UIAlertAction actionWithTitle:NSLocalizedString(@"ok", nil) style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
    }]];
    
    [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:alert animated:YES completion:nil];
}

@end
