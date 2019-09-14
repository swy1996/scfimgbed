const config = {
    tencent_cos: {
        SecretId: '******', //用户的 SecretId
        SecretKey: '******', //用户的 SecretKey
        Bucket: '******', //存储桶名称
        Region: '******', //存储桶所在地域
        Key: 'images/', //目标路径文件夹，我这里默认存储桶下images文件夹
    }
}

module.exports = config