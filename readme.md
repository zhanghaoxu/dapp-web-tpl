# 海外区块链 Webapp 开发模板

## 开发指令

npm run dev

## 构建指令

### 测试环境

npm run build:test

### 线上环境

npm run build:prod

### 线上带 cdn

npm run build:cdn

## 基于 umi 4

基本配置查看 https://umijs.org/

## 支持以下功能

1. 请求加密
   使用方式：请求选项中增加 encrypt:true 示例：

```js
export const login = (data?: any) => {
  return request.post('/api/user/login', {
    data,
    encrypt,
  });
};
```

2. 支持线上 cdn
   使用方式：
   (1) 修改.env 中的 cdn 配置 cdn 一般每个项目要在桶中新增一个文件夹。
   (2) 使用打包命令 npm run build:cdn

3. 钱包的简易封装

/utils/wallet

4. EIP-4361 登录

/utils/index

5. 根据环境变量获取当前环境区块链信息配置

需要根据当前业务配置使用的链信息
/constants/chainInfo

6. 谷歌分析接入

.env 修改 GTAG_ID
