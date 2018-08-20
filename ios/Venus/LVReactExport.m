//
//  LVReactExport.m
//  Venus
//
//  Created by LiuCharles on 22/09/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "LVReactExport.h"
#include "libscrypt.h"
#import "NSString+LVHexStringToBinary.h"
#import "LVConfiguration.h"
#import "LVDeviceAuthentication.h"

@implementation LVReactExport

RCT_EXPORT_MODULE(LVReactExport);

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

RCT_EXPORT_METHOD(helloWorld:(NSString *)name) {
  NSLog(@"%@", name);
}

- (NSString *)libscryptWith:(NSString *)password
                       salt:(NSString *)salt
                          n:(NSInteger)n
                          r:(NSInteger)r
                          p:(NSInteger)p
                  bufferLen:(NSInteger)bufferLen {
  int ret;
  
  NSData *saltBinary = [salt mx_hex2Data];
  
  const char * password_c = [password cStringUsingEncoding:NSUTF8StringEncoding];
  
  
  uint8_t *hashbuf = (uint8_t *)malloc(sizeof(uint8_t) * bufferLen);
  
  ret = libscrypt_scrypt((const unsigned char *)password_c,strlen(password_c), [saltBinary bytes], saltBinary.length, n, (uint32_t)r, (uint32_t)p, hashbuf, bufferLen);
  
  NSMutableString *result = [NSMutableString string];
  
  for (size_t i = 0; i < bufferLen; i++)
  {
    [result appendFormat:@"%02x", hashbuf[i]];
  }
  
  free(hashbuf);
  return result;
}


RCT_REMAP_METHOD(libscrypt,
                  libscrypt:(NSString *)password
                  salt:(NSString *)salt
                  n:(NSInteger)n
                  r:(NSInteger)r
                  p:(NSInteger)p
                  bufferLen:(NSInteger)bufferLen
                 libscryptWithResolver:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject) {
  
  dispatch_async(dispatch_get_global_queue(QOS_CLASS_BACKGROUND, 0), ^{
    NSString *result = [self libscryptWith:password salt:salt n:n r:r p:p bufferLen:bufferLen];
    resolve([result copy]);
  });
}

RCT_EXPORT_METHOD(libscrypt:(NSString *)password
                  salt:(NSString *)salt
                  n:(NSInteger)n
                  r:(NSInteger)r
                  p:(NSInteger)p
                 bufferLen:(NSInteger)bufferLen
                  callback:(RCTResponseSenderBlock)callback)
{
  NSString *result = [self libscryptWith:password salt:salt n:n r:r p:p bufferLen:bufferLen];
  callback(@[result]);
}

RCT_EXPORT_METHOD(updateAppConfig:(NSDictionary *)appConfig)
{
    if (appConfig && [appConfig isKindOfClass:[NSDictionary class]]) {
        NSString *manifest = [appConfig objectForKey:@"manifest"];
        if (manifest && manifest.length > 0) {
            LVConfiguration.enterpriseClientManifestURL = manifest;
        }
    }
}

#pragma mark - Auth Support

RCT_REMAP_METHOD(getAuthSupport,
                 getAuthSupportWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    NSDictionary *support = @{@"password" : @([LVDeviceAuthentication isDeviceAuthTypeAvailable:LVDeviceAuthTypePassword]),
                              @"touchid" : @([LVDeviceAuthentication isDeviceAuthTypeAvailable:LVDeviceAuthTypeTouchID]),
                              @"faceid" : @([LVDeviceAuthentication isDeviceAuthTypeAvailable:LVDeviceAuthTypeFaceID])
                              };
    
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:support
                                                       options:NSJSONWritingPrettyPrinted
                                                         error:&error];
    
    NSString *jsonString = @"";
    
    if (!jsonData) {
        reject([@(error.code) stringValue], @"JSON Serialization Error", error);
    } else {
        jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
    
    jsonString = [jsonString stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
    [jsonString stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    
    resolve(jsonString);
}

RCT_REMAP_METHOD(startAuth,
                 startAuth:(NSString *)param withResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    if ([param isEqualToString:@"touchid"] || [param isEqualToString:@"faceid"]) {
        [LVDeviceAuthentication evaluatePolicyWith:^(BOOL success, NSString * _Nullable errCode, NSString * _Nullable errMsg) {
            if (success) {
                resolve(@(YES));
            } else {
                reject(errCode, errMsg, nil);
            }
        }];
    } else {
        reject([@(-1) stringValue], @"Auth type not supported.", nil);
    }
}

- (NSDictionary *)constantsToExport
{
  return @{
           @"isAdHoc": @([self isAdHoc]),
           @"isAppStore" : @([self isAppStore]),
           @"isDebug": @([self isDebug]),
           @"isRelease": @([self isRelease]),
           @"isEnterprise": @([self isEnterprise]),
           };
}

- (BOOL)isAdHoc {
#ifdef ADHOC
  return YES;
#else
  return NO;
#endif
}

- (BOOL)isAppStore {
#ifdef APPSTORE
  return YES;
#else
  return NO;
#endif
}

- (BOOL)isDebug {
#ifdef DEBUG
  return YES;
#else
  return NO;
#endif
}

- (BOOL)isRelease {
  return !([self isDebug] || [self isAdHoc] || [self isAppStore]);
}

- (BOOL)isEnterprise {
#ifdef ENTERPRISE
    return YES;
#else
    return NO;
#endif

}

@end
