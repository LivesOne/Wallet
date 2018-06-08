//
//  MXUpgradeTask.h
//  MxBrowser-iPhone
//
//  Created by LiuCharles on 18/01/2018.
//  Copyright © 2018 www.maxthon.com. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface MXUpgradeTask : NSObject
- (instancetype)initWithDependencyTask:(MXUpgradeTask *)dependencyTask;

- (BOOL)execute;
@end

#pragma mark - MXAppUpgradeTask

@interface MXAppUpgradeTask : MXUpgradeTask
@end

NS_ASSUME_NONNULL_END
