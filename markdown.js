const fs = require('fs');
const path = require("path");

const markdown = async () => {
    //获取文件夹下所有文件
    const fileList = fs.readdirSync(path.join(__dirname, './post'));
    //筛选.md后缀
    markdownList = fileList.filter((filename) => {
        return path.extname(filename) === '.md';
    })
    //处理.md文件
    articalList = markdownList.map((name) => {
        //获取文件名
        let fileName = path.basename(name, '.md');
        //以@分割时间和文件标题
        let [time, title] = fileName.split('@');
        //作为对象返回
        return {
            time, //日期
            title, //标题
            name: fileName, //全名
        }
    })

    //时间从新到旧排序
    articalList.sort((a,b) => {
        return a.time > b.time ? -1 : 1 ;
    })
    
    //[{}, {}, {}]
    return articalList;
}

module.exports = markdown;