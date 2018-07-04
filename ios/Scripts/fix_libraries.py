#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import sys
import json
import copy
from termcolor import colored
from pbxproj import XcodeProject
from pbxproj.PBXKey import PBXKey
from pbxproj.pbxextensions import PBXBuildFile
from pbxproj.pbxextensions import XCBuildConfiguration

class XcodeProjectHelper:
    def __init__(self, path=None):
        self._project = XcodeProject.load(path)
        self._rootKey = self._project['rootObject']
        self._rootObject = self._project.objects[self._rootKey]
    
    @property
    def root(self):
        return self._project.objects[self._rootKey]
    
    @property
    def target_keys(self):
        return self._rootObject['targets']
    
    @property
    def config_list_keys(self):
        keys = [self._rootObject['buildConfigurationList']]
        for k in self.target_keys:
            keys.append(self._project.objects[k]['buildConfigurationList'])
        return list(set(keys))
    
    @property
    def config_list_objects(self):
        return map(lambda k: self._project.objects[k], self.config_list_keys)
    
    @property
    def config_keys(self):
        keys = reduce(lambda a, b: a + b, map(lambda x: x['buildConfigurations'], self.config_list_objects))
        return list(set(keys))
    
    @property
    def config_objects(self):
        return map(lambda k: self._project.objects[k], self.config_keys)

    def get_configs_by_name(self, name):
        return filter(lambda c: c.name == name, self.config_objects)
    
    def config_list_for_config(self, config_key):
        for config_list in self.config_list_objects:
            configs = config_list['buildConfigurations']
            if config_key in configs:
                return config_list
        return None
    
    def clone_build_config(self, config, new_name):
        obj = {
            u'_id': XCBuildConfiguration._generate_id(),
            u'isa': XCBuildConfiguration.__name__,
            u'name': new_name,
            u'buildSettings': config.buildSettings
            }
        base_config_ref = config['baseConfigurationReference']
        if base_config_ref is not None:
            obj[u'baseConfigurationReference'] = base_config_ref
        return XCBuildConfiguration().parse(obj)


IGNORE_PROJECTS_ENDS = (
    'Tests.xcodeproj/project.pbxproj',
    'Pods.xcodeproj/project.pbxproj',
    'HelloWorld.xcodeproj/project.pbxproj'
)

def react_native_root_path():
    cur_path = os.getcwd()
    while cur_path.find('node_modules') > -1:
        cur_path = os.path.split(cur_path)
    return cur_path

def package_json_path():
    return os.path.join(react_native_root_path(), 'package.json')

def node_modules_path():
    return os.path.join(react_native_root_path(), 'node_modules')

def get_mappings():
    package_json = None
    with open(package_json_path(), 'r') as f:
        package_json = json.load(f, encoding='utf-8')
    
    mappings = {}
    schemes  = package_json['xcodeSchemes']
    if 'Debug' in schemes: mappings['Debug'] = schemes['Debug']
    if 'Release' in schemes: mappings['Release'] = schemes['Release']
    
    return mappings

# Update Project

def remove_null_file_ref(pbxPath):
    changed = False
    file_data = ''
    with open(pbxPath, 'r') as f:
        for line in f:
            if '/* (null) in ' in line:
                changed = True
            else:
                file_data += line
    if changed:
        with open(pbxPath, 'w') as f:
            f.write(file_data)

def update_project(pbxPath):
    remove_null_file_ref(pbxPath)

    helper = XcodeProjectHelper(pbxPath)
    mappings = get_mappings()

    changed = False
    # Go through each mapping and figure out if we need to clone it.
    for source_config_name in mappings:
        for dest_config_name in mappings[source_config_name]:
            # Do we have the clone already?
            dest_configs = helper.get_configs_by_name(dest_config_name)

            if len(dest_configs) == 0:
                source_configs = helper.get_configs_by_name(source_config_name)

                for source_config in source_configs:
                    clone = helper.clone_build_config(source_config, dest_config_name)
                    clone['name'] = dest_config_name
                    clone_key = clone.get_id()

                    helper._project.objects[clone_key] = clone

                    config_list = helper.config_list_for_config(source_config._id)
                    bcs = config_list['buildConfigurations']
                    bcs.append(PBXKey(clone_key, bcs[0].get_parent()))

                    changed = True
                
                print ' ', colored('✔', 'green'), ' [fix-libraries]: %s -> %s created in %s' % (colored(source_config_name, 'green'), colored(dest_config_name, 'green'), pbxPath)
            else:
                print ' ', colored('➜', 'white'), ' [fix-libraries]: %s -> %s skipped in %s' % (source_config_name, dest_config_name, pbxPath)

    if changed:
        helper._project.save()
    
    return True

def fix_libraries(paths):
    result = True
    for pbxPath in paths:
        result = result and update_project(pbxPath)
    return result
        
def find_all_libraries_paths():
    libraries_paths = []
    for dirpath, _, files in os.walk(node_modules_path()):
        for filename in files:
            if filename == 'project.pbxproj':
                path = os.path.join(dirpath, filename)
                if True == reduce(lambda x, y: x and not path.endswith(y), IGNORE_PROJECTS_ENDS, True):
                    libraries_paths.append(path)
    return libraries_paths

def main():
    print '\nfix-libraries ...'

    paths = find_all_libraries_paths()

    if True == fix_libraries(paths):
        print ' ', colored('✔', 'green'), ' Done '
    else:
        print colored('⃠ ', 'red'), '[fix-libraries]: Error!'

if __name__ == '__main__':
    main()