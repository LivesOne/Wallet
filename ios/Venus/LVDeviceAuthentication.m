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
+ (void)evaluatePolicyWith:(void (^)(BOOL, NSError * _Nullable))callback
{
    LAContext *contex = [LVDeviceAuthentication sharedInstance].contex;
    NSString  *reason = NSLocalizedString(@"need_auth_into_wallet", nil);
    [contex evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics localizedReason:reason reply:callback];
}

@end
