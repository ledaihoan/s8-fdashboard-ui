# S8 Finance Dashboard Assessment
This is the demo project of me which is related to technical assessment round of an interview process.
Try the live version at: https://s8-fd-ui.technoma.tech

## Guide for local run and deployment:
- Install NVM.sh and NodeJS: https://github.com/nvm-sh/nvm
- Install Docker: https://docs.docker.com/engine/install/
- Detailed guide will soon be available at https://github.com/ledaihoan/s8-fd-devops.git
```shell
# Use this for deploy to server with nvm, node and pm2 installed
# env name is development/production
./runservice.sh development
# Use this to local run with docker
./run_with_docker.sh
```
## Further development ideas
- To apply existing Infrastructure solution (prefer AWS as related to my previous working experience & knowledge)
  - Resource store: AWS S3
  - Gateway / CDN Edge Caching / Secure with Cloud Front: make application logic much easier with cost optimized
- Backend development (In Progress + In-complete): https://github.com/ledaihoan/s8-fd-server.git 
  - Web Socket wrapper to allow users to subscribe to Exchange Market Feeds
  - Private APIs: may be, the primary purpose is to safeguard integration credential while manipulating private APIs which require authentication
- Better architecture discovery