---
title: Tutorial 3 - Enable Role Federated Access
description: how to enable a role for federated access
category: Guide
parent: Tutorials
layout: docs
permalink: /documentation/guide/tutorials/enable-role-federated-access
---

# Enable role federated access on AWS

> :warning: After completing this tutorial the federation process is still not over. Go to the next tutorial to complete the procedure and start using SSO.

## Create a new role

### 1. Go to the IAM console
Go to the IAM console in your AWS Account and select Roles from the left-side column.

### 2. Create role
Click on **Create Role** and select **SAML 2.0 federation** as the type of trusted entity; from the SAML provider drop-down menu, select the IAM Identity Provider created in the previous step.

### 3. Allow Programmatic and AWS Management Console access
Select **Allow programmatic and AWS Management Console access** and click on **Next: Permissions*** button.

### 4. Add policy
Select the policy you want to attach to the newly created Role, e.g. *AdministratorAccess*. Then, click **Next: Tags** button.

### 5. Tags definition
Add any tag you want if you need to. Then click **Next: Review**

### 6. Name the role
Assign a name to the Role and click **Create Role**.


## Edit an existing role
Go to the IAM console in your AWS Account and select Roles from the left-side column.

### 1. Select the role you want to edit
From the list of Roles, find the Role you want to edit and click on its **Role name**. A summary of the role will be displayed.

### 2. Edit trust relationships
In the Role’s summary, click on the “**Trust relationships”** tab. Click on **Edit trust relationship** *and* paste the.

### 3. Update Trust Policy
Click on “**Update Trust Policy”** to save changes
