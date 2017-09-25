//
//  NSString+LVHexStringToBinary.m
//  Venus
//
//  Created by LiuCharles on 22/09/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "NSString+LVHexStringToBinary.h"

@implementation NSString (LVHexStringToBinary)

- (NSData *)mx_hex2Data {
  NSString *hexStr = [self stringByReplacingOccurrencesOfString:@" " withString:@""];
  NSMutableData *data = [NSMutableData data];
  
  unsigned char whole_byte;
  char byte_chars[3] = {'\0', '\0', '\0'};
  int len = (int)(hexStr.length / 2);
  for (int i = 0; i < len; i++)
  {
    byte_chars[0] = [hexStr characterAtIndex:i * 2];
    byte_chars[1] = [hexStr characterAtIndex:i * 2 + 1];
    whole_byte = strtol(byte_chars, NULL, 16);
    
    [data appendBytes:&whole_byte length:1];
  }
  return [data copy];
}

@end
