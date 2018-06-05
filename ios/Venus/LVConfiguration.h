//
//  LVConfiguration.h
//  Venus
//
//  Created by XiaoLei Tian on 2018/6/5.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

FOUNDATION_EXPORT NSString * const LVEnterpriseClientManifestURLUpdateNotification;

@interface LVConfiguration : NSObject

@property (class, copy, nonatomic) NSString *enterpriseClientManifestURL;

@end
