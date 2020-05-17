# Travis Configuration

Encrypting frontend and backend .env files so that build will work after each git push.

[Link here](https://docs.travis-ci.com/user/encrypting-files/)

```bash
> tar cvf env_files.tar frontend/.env backend/.env
> travis encrypt-file env_files.tar
> git add env_files.tar.enc
> git commit -m 'use secret archive'
> git push
```

Add decryption step to `.travis.yml`

```yaml
before_install:
  - openssl aes-256-cbc -K $encrypted_5880cf525281_key -iv $encrypted_5880cf525281_iv -in env_files.tar.enc -out env_files.tar -d
  - tar xvf env_files.tar
```
