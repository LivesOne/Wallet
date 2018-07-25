//
//  LVDeviceAuthentication.h
//  Venus
//
//  Created by XiaoLei Tian on 2018/7/20.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSUInteger, LVDeviceAuthType) {
    LVDeviceAuthTypePassword,
    LVDeviceAuthTypeTouchID,
    LVDeviceAuthTypeFaceID,
};

@interface LVDeviceAuthentication : NSObject

+ (BOOL)isDeviceAuthTypeAvailable:(LVDeviceAuthType)type;

+ (void)evaluatePolicyWith:(void(^)(BOOL success, NSError * __nullable error))callback;;

@end
