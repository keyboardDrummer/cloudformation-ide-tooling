/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

(self as any).MonacoEnvironment = {
    getWorkerUrl: (moduleId: string, label: string) => {
        return './editor.worker.bundle.js'
    }
}

import {
    MonacoServices
} from 'monaco-languageclient';
import * as monaco from "monaco-editor";
import { createLanguageClient } from "./languageClient"

// register Monaco languages
monaco.languages.register({
    id: 'json',
    extensions: ['.json', '.bowerrc', '.jshintrc', '.jscsrc', '.eslintrc', '.babelrc'],
    aliases: ['JSON', 'json'],
    mimetypes: ['application/json'],
});

const jsonValue =
`{
   "AWSTemplateFormatVersion" : "2010-09-09",

   "Description" : "AWS CloudFormation Sample Template AutoScalingMultiAZWithNotifications: Create a multi-az, load balanced and Auto Scaled sample web site running on an Apache Web Serever. The application is configured to span all Availability Zones in the region and is Auto-Scaled based on the CPU utilization of the web servers. Notifications will be sent to the operator email address on scaling events. The instances are load balanced with a simple health check against the default web page. **WARNING** This template creates one or more Amazon EC2 instances and an Application Load Balancer. You will be billed for the AWS resources used if you create a stack from this template.",

   "Parameters" : {
     "VpcId" : {
       "Type" : "AWS::EC2::VPC::Id",
       "Description" : "VpcId of your existing Virtual Private Cloud (VPC)",
       "ConstraintDescription" : "must be the VPC Id of an existing Virtual Private Cloud."
     },

     "InstanceType" : {
       "Description" : "WebServer EC2 instance type",
       "Type" : "String",
       "Default" : "t2.small",
       "AllowedValues" : [ "t1.micro", "t2.nano", "t2.micro", "t2.small", "t2.medium", "t2.large", "m1.small", "m1.medium", "m1.large", "m1.xlarge", "m2.xlarge", "m2.2xlarge", "m2.4xlarge", "m3.medium", "m3.large", "m3.xlarge", "m3.2xlarge", "m4.large", "m4.xlarge", "m4.2xlarge", "m4.4xlarge", "m4.10xlarge", "c1.medium", "c1.xlarge", "c3.large", "c3.xlarge", "c3.2xlarge", "c3.4xlarge", "c3.8xlarge", "c4.large", "c4.xlarge", "c4.2xlarge", "c4.4xlarge", "c4.8xlarge", "g2.2xlarge", "g2.8xlarge", "r3.large", "r3.xlarge", "r3.2xlarge", "r3.4xlarge", "r3.8xlarge", "i2.xlarge", "i2.2xlarge", "i2.4xlarge", "i2.8xlarge", "d2.xlarge", "d2.2xlarge", "d2.4xlarge", "d2.8xlarge", "hi1.4xlarge", "hs1.8xlarge", "cr1.8xlarge", "cc2.8xlarge", "cg1.4xlarge"]
 ,
       "ConstraintDescription" : "must be a valid EC2 instance type."
     },

     "KeyName" : {
       "Description" : "The EC2 Key Pair to allow SSH access to the instances",
       "Type" : "AWS::EC2::KeyPair::KeyName",
       "ConstraintDescription" : "must be the name of an existing EC2 KeyPair."
     },

     "SSHLocation" : {
       "Description" : "The IP address range that can be used to SSH to the EC2 instances",
       "Type": "String",
       "MinLength": "9",
       "MaxLength": "18",
       "Default": "0.0.0.0/0",
       "AllowedPattern": "(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})/(\\d{1,2})",
       "ConstraintDescription": "must be a valid IP CIDR range of the form x.x.x.x/x."
     }
   },

   "Resources" : {

     "LaunchConfig" : {
       "Type" : "AWS::AutoScaling::LaunchConfiguration",
       "Properties" : {
         "KeyName" : { "Ref" : "KeyName" },
         "ImageId" : { "Fn::FindInMap" : [ "AWSRegionArch2AMI", { "Ref" : "AWS::Region" },
                                           { "Fn::FindInMap" : [ "AWSInstanceType2Arch", { "Ref" : "InstanceType" }, "Arch" ] } ] },
         "SecurityGroups" : [ { "Ref" : "InstanceSecurityGroup" } ],
         "InstanceType" : { "Ref" : "InstanceType" },
         "InstanceType": { "Ref": "InstanceType" },
       }
     },

     "InstanceSecurityGroup" : {
       "Type" : "AWS::EC2::SecurityGroup",
       "Properties" : {
         "GroupDescription" : "Enable SSH access and HTTP from the load balancer only",
         "SecurityGroupIngress" : [ {
           "IpProtocol" : "tcp",
           "FromPort" : "22",
           "ToPort" : "22",
           "CidrIp" : { "Ref" : "SSHLocation"}
         }],
         "VpcId" : { "Ref" : "VpcId" }
       }
     }
   }
 }
`;

const yamlValue =
`AWSTemplateFormatVersion: '2010-09-09'
 Parameters:
   InstanceType:
     Description: WebServer EC2 instance type
     Type: String
     Default: t2.small
     AllowedValues: [t1.micro, t2.nano, t2.micro, t2.small, t2.medium, t2.large, m1.small,
                     m1.medium, m1.large, m1.xlarge, m2.xlarge, m2.2xlarge, m2.4xlarge, m3.medium,
                     m3.large, m3.xlarge, m3.2xlarge, m4.large, m4.xlarge, m4.2xlarge, m4.4xlarge,
                     m4.10xlarge, c1.medium, c1.xlarge, c3.large, c3.xlarge, c3.2xlarge, c3.4xlarge,
                     c3.8xlarge, c4.large, c4.xlarge, c4.2xlarge, c4.4xlarge, c4.8xlarge, g2.2xlarge,
                     g2.8xlarge, r3.large, r3.xlarge, r3.2xlarge, r3.4xlarge, r3.8xlarge, i2.xlarge,
                     i2.2xlarge, i2.4xlarge, i2.8xlarge, d2.xlarge, d2.2xlarge, d2.4xlarge, d2.8xlarge,
                     hi1.4xlarge, hs1.8xlarge, cr1.8xlarge, cc2.8xlarge, cg1.4xlarge]
     ConstraintDescription: must be a valid EC2 instance type.
   KeyName:
     Description: The EC2 Key Pair to allow SSH access to the instances
     Type: AWS::EC2::KeyPair::KeyName
     ConstraintDescription: must be the name of an existing EC2 KeyPair.
   SSHLocation:
     Description: The IP address range that can be used to SSH to the EC2 instances
     Type: String
     MinLength: 9
     MaxLength: 18
     Default: 0.0.0.0/0
     AllowedPattern: (\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/(\d{1,2})
     ConstraintDescription: must be a valid IP CIDR range of the form x.x.x.x/x.
 Resources:
   LaunchConfig:
     Type: AWS::AutoScaling::LaunchConfiguration
     Properties:
       KeyName: !Ref 'KeyName'
       ImageId: !FindInMap [AWSRegionArch2AMI, !Ref 'AWS::Region', !FindInMap [AWSInstanceType2Arch,
                                                                               !Ref 'InstanceType', Arch]]
       SecurityGroups: [!Ref 'InstanceSecurityGroup']
       InstanceType: 'Ref InstanceType'
   InstanceSecurityGroup:
     Type: AWS::EC2::SecurityGroup
     Properties:
       GroupDescription: Enable SSH access and HTTP from the load balancer only
       SecurityGroupIngress:
         - IpProtocol: tcp
           FromPort: 22
           ToPort: 22
           CidrIp: !Ref 'SSHLocation'`

function createEditor(element: HTMLElement, value: string, language: string) {
    const result: monaco.editor.IStandaloneCodeEditor = monaco.editor.create(element, {
        model: monaco.editor.createModel(value, language, monaco.Uri.parse('inmemory://model.' + language)),
        glyphMargin: true,
        gotoLocation: { multiple: 'gotoAndPeek' },
        minimap: { enabled: false},
        lightbulb: {
            enabled: true
        }
    });
    MonacoServices.install(result as any);
    return result;
}
createEditor(document.getElementById('json')!, jsonValue, "json")
createEditor(document.getElementById('yaml')!, yamlValue, "yaml")

const jsonLanguageClient = createLanguageClient('json');
jsonLanguageClient.start();

const yamlLanguageClient = createLanguageClient('yaml');
yamlLanguageClient.start();