
# ⚛ IPFS telegra.ph clone

用于将数据发布到 IPFS 网络的极简发布工具。
ui克隆来自 [Telegra.ph](http://telegra.ph)

在输入文章标题和昵称之后，用户即可随意创作，并且支持图文、gif、视频内容。我们发布文章之后，就能够获得这篇文章的独立网址。我们只需要将上面获得的文章链接发送给好友，就能够在浏览器打开文章来阅读。

技术原理：https://ipfs.io/ipfs/QmPop46rv7m8LkxJK2Ar75Awy8gWBdkwrrkoEguMbGcPmo/

# 特点
* 操作简洁
* 页面干净
* 无需登陆
* 支持图片、gif、mp4即时插入并预览
* 支持 Youtube 、Vimeo 外链和预览

# 部署 

将public上传到任意环境即可。

# ipfs上传接口

默认使用 localhost:5001 ，通过页面 location.hash 传递域名可以覆盖整个配置，例如 api.abc.com ,将会调用 api.abc.com/api/v0/add 上传数据。

# 环境变量

window.api_host 提交到ipfs的接口，可以只实现 /api/v0/add 

window.ipfs_gateway 发布成功后默认跳转的ipfs网关

自行部署的时候请根据情况修改这两个变量。

# 使用建议

有时候发送的时候会失败，跨域错误，这个时候刷新一次重新提交即可，内容会缓存在 localStorage 里面。

发送成功后，可以用多个不同网关打开一次，增加数据源数量，如果有条件最好自己的节点存储一份。

# 图片附件

支持图片(png、jpg、jpeg、gif、webp、jfif)、视频(mp4、webm)格式内容添加，页面引入目录在 /ipfs/ 下面，使用不同网关打开时，自动调用当前网关加载资源。

如果要添加其它类型附件，请自己上传，然后添加连接，推荐使用 /ipfs/ 目录，不使用固定的域名，方便多个网关打开后使用当前网关加载。

# 样例

cid：QmTJGLkgQujN8Wqx5kX1Eotyiqx7bAaTgcoDnsK6CV81LA

[crossbell](https://ipfs.crossbell.io/ipfs/QmTJGLkgQujN8Wqx5kX1Eotyiqx7bAaTgcoDnsK6CV81LA/#cdn.ipfsscan.io)

[eth.sucks](https://eth.sucks/ipfs/QmTJGLkgQujN8Wqx5kX1Eotyiqx7bAaTgcoDnsK6CV81LA/#cdn.ipfsscan.io)

[img2ipfs](https://gateway.img2ipfs.com/ipfs/QmTJGLkgQujN8Wqx5kX1Eotyiqx7bAaTgcoDnsK6CV81LA/#cdn.ipfsscan.io)

[ipfsscan](https://gateway.ipfsscan.com/ipfs/QmTJGLkgQujN8Wqx5kX1Eotyiqx7bAaTgcoDnsK6CV81LA/#cdn.ipfsscan.io)

[ipfs.io](https://ipfs.io/ipfs/QmTJGLkgQujN8Wqx5kX1Eotyiqx7bAaTgcoDnsK6CV81LA/#cdn.ipfsscan.io)

任意一个ipfs网关都可以使用。

你也可以自己下载ipfs-desktop ，访问 http://127.0.0.1:8080/ipfs/QmTJGLkgQujN8Wqx5kX1Eotyiqx7bAaTgcoDnsK6CV81LA/

## Thanks
 * http://telegra.ph
