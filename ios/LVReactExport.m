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

@implementation LVReactExport

RCT_EXPORT_MODULE()

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

- (NSDictionary *)constantsToExport
{
  return @{
           @"isAdHoc": @([self isAdHoc]),
           @"isAppStore" : @([self isAppStore]),
           @"isDebug": @([self isDebug]),
           @"isRelease": @([self isRelease])
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

@end
