noop Quick Start Guide
======================

# What is noop?

noop is an application platform for you to build, run, and live with your apps. You write code and provide noop with a description of your application via a configuration file or files (called noopfiles), and noop takes care of the rest.

A noopfile is a configuration file that lives in your code's repository. It describes the structure of your application in terms of a collection of components (which you can think of as running code), resources (which you can think of as backend services like databases), and the relationships between them. Each version of your application will result in a deployment of a new version of each component when it is deployed, but the resources will stick around.

This guide will help you to get started using noop by deploying a sample application, so you can quickly gain a better understanding of how components, resources, and a noopfile all work together.

Let's get started!

# The sample application

The sample application is a simple single page web app to manage food samples that are handed out at a grocery store. The code and noopfiles for it live in this repository, and it's written using [nodejs](https://nodejs.org/) and [Vue.js](https://vuejs.org/). It is comprised of:

1. A [DynamoDB](https://aws.amazon.com/dynamodb/) **resource** to store to-do list items
2. A **function component** to list the samples currently being served
3. A **function component** to add a new food sample to be served
4. A **function component** to stop serving a food sample
5. A **service component** that returns a web page that allows a user to view and manage the samples being handed out

A **function component** executes some code statelessly in a container. Every time a function component is called (like via a web request), a new container is created. After the function call is completed, the container is destroyed.

A **service component** also executes some code statelessly in a container. The difference between service and function components is that service containers are more long-lived. A single service container can handle multiple calls over the course of its lifetime.

**Resources** have an indefinite lifespan. They are created in noop through the noop console, or are automatically generated by the noop CLI locally. Databases are the most obvious example of a resource, but it also includes other long-lived things like queues, caches, object stores, etc.

## Getting Started

First, you'll need to fork this repository in GitHub. Open up `https://github.com/rearc/noop-quickstart` in a browser, click the `Fork` button in the upper right, and fork the repository into your account. Once you've forked the repo, you'll need to clone your fork to your local machine. If you haven't already, open up a terminal and enter:

```bash
git clone git@github.com:MYACCOUNT/noop-quickstart.git
cd noop-quickstart
```

Make sure to replace `MYACCOUNT` with whatever your account name is in GitHub. Once cloned, you'll notice that the sample app is organized into directories in the root of the repository:

```bash
noop-quickstart
├ list-samples
│  ├ Noopfile
│  ├ package.json
│  └ index.js
├ add-sample
│  ├ Noopfile
│  ├ package.json
│  └ index.js
├ remove-sample
│  ├ Noopfile
│  ├ package.json
│  └ index.js
└ ui
   ├ Noopfile
   ├ package.json
   ├ server.js
   └ (a bunch of other stuff)
```

Each directory corresponds to a component, and contains a `Noopfile` that describes the component. The rest of the contents of the directories is regular old nodejs stuff. Note that noop is agnostic with respect to the layout of your repository - you can use whatever directory structure you want. Let's look at the noopfile for the `list-samples` component:

```
COMPONENT list-samples
ROUTE -m GET /api/samples
RESOURCE samples dynamodb -p hashKeyName=id -p hashKeyType=S
ENV SAMPLES_TABLE $.resources.samples.tableName
ENV SAMPLES_ENDPOINT $.resources.samples.endpoint
FROM rearc/noop-nodejs-function:v6.11
COPY package.json package.json
RUN npm install
COPY *.js /function/
FUNCTION ["/function/index.js", "handler"]

```

You may notice that the noopfile format looks very similar to a [Dockerfile](https://docs.docker.com/engine/reference/builder/). In fact, the noopfile grammar is an extension of the Dockerfile grammar.

The `COMPONENT` directive tells noop what the name of the component is. It also acts kind of like a header, in that everything between it and `FUNCTION` or `SERVICE` later in the noopfile describes the component.

The `ROUTE` directive tells noop how web requests should be routed to the component. In this case, it routes all HTTP `GET` requests for `/api/samples` to this component.

The `RESOURCE` directive tells noop that this component depends on a DynamoDB resource named `samples`. If the `samples` resource is not available or does not meet the requirements of this directive (in this case, the only requirement being that it be DynamoDB), then the component cannot be deployed. The `-p hashKeyName=id -p hashKeyType=S` indicates that the DyanmoDB has a hash key named `id` of type string.

The `ENV` directive works just like it does in a vanilla Dockerfile, except that the value can be a [JSON path](https://goessner.net/articles/JsonPath/) to a property from a part of your application's definition. DynamoDB resources have a `tableName` property that is the name of the DynamoDB table of the resource, so `$.resources.samples.tableName` means "the `tableName` property of the `samples` resource." DynamoDB resources also have an `endpoint` property that is the location to connect to to reach DynamoDB, so `$.resources.samples.endpoint` means "the `endpoint` property of the `samples` resource." Both of these are only needed so they can be passed to the [AWS DynamoDB Document Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html), as seen in `list-samples/index.js` on line 16.

The `FROM` directive is a vanilla Dockerfile `FROM`. However, in this specific example, the image being used is a helper image written and maintained by Rearc to allow users to quickly write nodejs function components by just exporting a handler function. Note that noop can run any container that binds to port 80, the nodejs function helper image just removes some boilerplate code that would otherwise be needed to run a web server (e.g. [Express.js](https://expressjs.com/)).

The `FUNCTION` directive tells noop that this component is a function component. The arguments to the `FUNCTION` directive tell the nodejs function helper image how to run the function inside the context of the container. In this case, the first argument is the path to the nodejs file that contains the function code, and the second argument is the name of the property exported by the file that has the function code (check out `exports.handler` on line 32 of `list-samples/index.js`).

All the other directives are vanilla Dockerfile directives.

You might want to take a moment to examine the contents of all of these directories.

## Testing locally

To test the sample application locally, you'll first need to install the noop CLI. In order to do so, you'll need to ensure that `node` (tested with `v10.11.0`), `npm` (tested with `6.4.1`), and `docker` (tested with `18.06.1-ce`) are installed. You'll also want to ensure that the docker daemon is running by entering the following into a terminal:

```bash
docker ps
```

Once these prerequisites are met, in the terminal you opened earlier, use:

```bash
npm install -g noop-local
```

This will install the noop CLI globally, so it will be available from anywhere on your system. Let's try running the application locally. Presuming you're still in the `noop-quickstart` directory, use:

```bash
noop run
```

The noop CLI will then read through the contents of the application repository. It will discover and read all of the noopfiles in the subdirectories, and run containers locally for each component using docker to emulate the behavior in the noop environment so that you can test stuff. Since some of the components have a resource requirement for a DynamoDB named `samples`, the CLI will also run a separate container with a local work-alike version of DynamoDB for testing.

Now that the application is running locally, open up a web browser and point it at `https://localnoop.app:1234`. Since the `ui` component is routed to by HTTP `GET`s to `*` (as you can see from the `ROUTE` directive in its noopfile), this will return the result of calling the `ui` component. After you've played with the sample application a little bit (hopefully not for too long, since it's not very interesting), open up `ui/src/components/sample-list.vue` in a text editor.

Change the `Samples currently being served` on line 3 to `Hello, noop!`, and save your changes. If the noop CLI is still running, it should automatically detect the change to the `ui` component, rebuild it, and replace the running container with the newly-built version. If you refresh your web browser, you should see your changes.

## Deploying into noop

Now that you've had a taste of how developing locally works in noop, let's try deploying your application into noop.

First, you'll need to open up the noop console in a web browser. It's available at `https://alpha.noop.app`. Currently, the only mechanism available for logging into the console is via a GitHub federated identity, so click the `Login with Github` button to create a noop account. If you are not already logged into GitHub in your browser session, you'll be prompted to do so. Once you have, you'll be prompted to allow noop read access to your Github identity if you haven't already.

Once you've jumped through these hoops, you should see the noop console. The first thing you'll need to do is import the forked repository into your personal space in noop. Click `Personal Space` on the right side of the console home page. This is a special space that belongs solely to you.

Click `Repos`. Here you can see a list of the repositories you've added to your personal space. To add the forked repository, click `New Repo`, and enter your GitHub user name in the `Owner/Organization Name` field, and the repository name (which will be `noop-quickstart` if you haven't changed it) into the `Project Name` field. Then, click `Submit`. You should see the repository added to your list of repositories.

Next, you'll need to create a new application from the repository you've just added. Click `Applications`. This is a list of the applications you've created in your personal space. Click `New App` to create a new application. Enter a name for your application in the `Application Name` field, choose the repository that you just added from the `Source Code Repo` drop down, and provide a description in the `Description` field. Then, click `Submit`. You should now see the application in the list of applications in your personal space.

Next, you'll need to create an environment for the application. An environment is a stand-alone running instance of the entire application, and you can have multiple environments for the same application (for example, dev and prod). Click the application you just created. You should see a list of environments for the application. Click `New Environment` to create a new environment for your application. You'll need to provide a name in the `Environment Name` field before clicking the `Submit` button. You should see a summary of the state of the environment you just created.

Next, you'll want to create the `samples` DynamoDB resource. Click `Resources`. You should see a list of the resource for this environment. Click `New Resource` to see a list of the available resource types you can create. Click `DynamoDB Database`, and enter `samples` in the `Resource Name` field, and `id` in the `Hash Key Name`, and select `String` from the `Hash Key Type` drop down. Click `Create`, and a DynamoDB resource will be created for the environment.

Now, let's build and deploy the application. You can either manually build and deploy a specific git ref OR set up `Flows` to automatically build and deploy new changes pushed to the master branch of your repo.

**Option 1** - `Flows`: Go back to the application view and click `Flows`. Click `New Flow`, fill out the template and click `Submit`. Currently only one flow template is available. In the future, you will be able to create custom flows. Next, to kick off flows, push a new commit to the master branch of your repo.

**Option 2** - `Manual build and deploy`: Click `Builds` from your environment page. This page will show you all the builds for this application. In order to build a new version of the application, you'll need to provide a git ref in the `git ref` field to build the application. Enter `master` in the `git ref` field and click `Start Build`. You should see an entry for the build you just created in the `pending` state. As the build progresses, this state will change. Wait for the state to become `complete`, and then let's deploy the sample application. Click `Stage Build` for the build you just created. You should see the `Change Status` of the environment change, and a `Deploy Changes` button should become available. Click `Deploy Changes` to trigger a deployment. This will take a little while, so while we wait for that to finish, let's associate an endpoint with the environment, otherwise the environment would not be accessible once deployed.

Click `Endpoints`. Here you will see a list of endpoints associated with the environment. Click `New Endpoint` to add one. Choose `alpha.noop.app` from the domain drop down, and enter the subdomain of `alpha.noop.app` you would like to use to access the environment. Click `Submit`, and you should see the endpoint you just created added to the list of endpoints for the environment.

Click the `Summary` page. When you application has been deployed, it will say that it is currently running the version of the build you deployed. To test its successful deployment, open `https://SUBDOMAIN.alpha.noop.app` in a web browser, where `SUBDOMAIN` is the subdomain you chose, to access your application.

Once your application is running, you can access the logs for each component by clicking `Components` for the environment and clicking the `View Logs` icon for the component.

## Go forth, dear nooper, and build!

At this point, you're ready to do some exploring on your own. Please take some time to try to build and deploy an application that you actually care about. If you run into any issues, or have any questions or concerns, please reach out to us on the Slack channel. 
