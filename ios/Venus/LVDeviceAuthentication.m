//
//  LVDeviceAuthentication.m
//  Venus
//
//  Created by XiaoLei Tian on 2018/7/20.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "LVDeviceAuthentication.h"
#import <LocalAuthentication/LocalAuthentication.h>

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
            if (error.code == kLAErrorUserFallback) {
                callback(NO, kAUTH_ERROR_SWITCH, error.localizedDescription);
            }
            else {
                callback(NO, [@(error.code) stringValue], error.localizedDescription);
            }
        }
    }];
}

@end
