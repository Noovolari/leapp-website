---
title: Tutorial4 - Assign role to gsuite principal
description: How to assign a role to a google's gsuite principal
category: Guide
parent: Tutorials
layout: docs
permalink: /documentation/guide/tutorials/assign-role-to-gsuite-principal
---

# Assign the role to G Suite Principal
This tutorial explains how to federate a Role with existing G Suite Users.

## 1. Access your G Suite admin console
Move to the **Users** section;

## 2. Select the user
Select the user you to want to enable SSO access to AWS and click on **User Information**

## 3. Edit AWS SAML Information.
In the IAM_Role field, insert the role Role ARN and IDP ARN separated with a comma and without spaces. Insert 28800 (seconds) in the SessionDuration field.

You successfully assigned a role to User.
Now the user can log in to the federated AWS account using its corporate identity.
