# Source code of zlml.cz

[![Build Status](https://travis-ci.org/mrtnzlml/zlml.cz.svg?branch=master)](https://travis-ci.org/mrtnzlml/zlml.cz)

# Install

```
git clone git@github.com:mrtnzlml/zlml.cz.git
cd zlml.cz
yarn install
```

And run it in development mode:

```
yarn dev
```

# Publish article

```
node .articles/compile.js
```

# What's inside

- Next.js 4 with SSR
- React 16 (Fiber core)
- Flow

# Things to do

- get rid of `aws-serverless-express` - it's fucking leaking shit
- https://www.datadoghq.com/pricing/
