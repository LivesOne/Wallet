//
//  LVConfiguration.m
//  Venus
//
//  Created by XiaoLei Tian on 2018/6/5.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "LVConfiguration.h"

NSString * const LVEnterpriseClientManifestURLUpdateNotification = @"LVEnterpriseClientManifestURLUpdateNotification";

static NSString * const kLVEnterpriseClientManifestURLKey = @"LVEnterpriseClientManifestURL";

@implementation LVConfiguration

+ (NSString *)enterpriseClientManifestURL {
    return [[NSUserDefaults standardUserDefaults] stringForKey:kLVEnterpriseClientManifestURLKey];
}

+ (void)setEnterpriseClientManifestURL:(NSString *)enterpriseClientManifestURL {
    [[NSUserDefaults standardUserDefaults] setObject:enterpriseClientManifestURL forKey:kLVEnterpriseClientManifestURLKey];
    [[NSNotificationCenter defaultCenter] postNotificationName:LVEnterpriseClientManifestURLUpdateNotification object:nil];
}

@end
