'use strict';

const fs = require('fs')
const path = require('path')

const config = require('./config')

var COS = require('cos-nodejs-sdk-v5');

var cos = new COS({
    SecretId: config.tencent_cos.SecretId,
    SecretKey: config.tencent_cos.SecretKey
});

exports.main_handler = async(event, context, callback) => {
        // 如果是GET请求，展示图床页面
        if (event.httpMethod == "GET") {
            let html = fs.readFileSync(path.resolve(__dirname, './upload.html'), {
                encoding: 'utf-8'
            })
            return {
                isBase64Encoded: false,
                statusCode: 200,
                headers: { 'Content-Type': 'text/html' },
                body: html
            }
        }
        // 如果是post请求，上传图片接口
        else if (event.httpMethod == "POST") {
            var req = JSON.parse(event.body)
                // 判断是否有img以及内容是否为base64编码
            if (req.img && !(req.img.indexOf(';base64,') == -1)) {
                //前端传入的base64图片字符串
                var base64img = req.img;
                //移除“data:image/png;base64,”字符串
                var base64Data = base64img.substring(base64img.indexOf(';base64,') + 8)
                    //转换为Buffer对象
                var buffer = Buffer.from(base64Data, 'base64');
                var time = `${new Date().getFullYear()}${new Date().getMonth()+1}${new Date().getDate()}`
                let data = await new Promise((res, rej) => {
                            cos.putObject({
                                        Bucket: config.tencent_cos.Bucket,
                                        Region: config.tencent_cos.Region,
                                        Key: `${config.tencent_cos.Key}${time}/${new Date().getTime()}${req.img_name?`-${req.img_name}`:''}`,
                    Body: buffer,
                }, function(err, data) {
                    if(err) {
                        rej(err)
                    } else {
                        res(data)
                    }
                });
            })
            return {
                code: 0,
                url: data.Location,
                statusCode: data.statusCode
            }
        } else {
            return {
                code: 201,
                msg: '参数错误！',
                status: 'error'
            }
        }
    } else {
        return {
            status: 404
        }
    }
};