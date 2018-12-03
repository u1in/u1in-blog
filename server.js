const Koa = require('koa')
const views = require('koa-views')
const Router = require('koa-router')
const logger = require('koa-logger')
const static = require('koa-static');
const fs = require('fs');
const path = require("path");
const marked = require('marked');
const markdown = require('./markdown');

const app = new Koa()
const router = new Router()

//markdown设置
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: false,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

//启用koa日志
app.use(logger())

//设置views为静态资源link可以调用
app.use(static(__dirname + '/views'));

//设置模板框架 使用nunjucks模板
app.use(views(__dirname + '/views/html', {
    map: {
        html: 'nunjucks',
    },
    options: {
        autoescape: false,
    }
}))

//重定向/到index
router.all('/', async(ctx, next) => {
    ctx.redirect(encodeURI('/index'));
})


//重定向没有页数的index到第一页
router.all('/index', async (ctx, next) => {
    ctx.redirect(encodeURI('/index/1'));
})

//文章列表路由
router.get('/index/:page', async(ctx, next) => {
    //每页文章数
    const pageNumber = 8;

    //当前页数
    const page = parseInt(ctx.params.page);

    //所有文章列表
    let list = await markdown();

    //总页数
    const totalPage = Math.ceil(list.length / pageNumber);


    //分页按钮， 以最多6个分页按钮设计
    let pagination = [];

    //生成分页按钮
    //懒了 先暴力
    if(page <= totalPage ) {

        if (page <= 3 && totalPage - page >= 3) {
            pagination = [1,2,3,4,5,6];
        }
        else if (page <= 3 && totalPage - page <= 3) {
            for (let i = 1; i <= totalPage; i++) {
                pagination.push(i);
            }
        }
        else if (page >= 3 && totalPage - page >= 3) {
            pagination = [page - 2, page - 1, page, page + 1, page + 2 , page + 3]
        }
        else if (page >= 3 && totalPage - page <= 3){
            pagination = [totalPage - 5, totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
        }

        //填充至模板返回
        await ctx.render('index', {
            title: '首页 | 右灵',
            articles: list.splice(0 + (page - 1) * pageNumber, pageNumber),
            pagination,
            currentPage: page,
            totalPage,
        })
    }
    else {

        //页码不合规范重定向
        ctx.redirect(encodeURI('/index/1'));
    }
})


//文章路由
router.get('/article/:name', async (ctx, next) => {
    //url解码文章名
    let mdName =  decodeURI(ctx.params.name);

    //读取文章字符串
    let html = fs.readFileSync(path.join(__dirname, `./post/${mdName}.md`), 'utf-8');

    //md转换成html
    let htmarkedHTMLml = marked(html);

    //填充至模板返回
    await ctx.render('article', {
        title: `${mdName.split('@')[1]} | 右灵`,
        text: htmarkedHTMLml,
    })
})

//关于路由
router.get('/about', async (ctx, next) => {
    //读取文章字符串
    let html = fs.readFileSync(path.join(__dirname, `./about/about.md`), 'utf-8');

    //md转换html
    let htmarkedHTMLml = marked(html);

    //填充至模板返回
    await ctx.render('article', {
        title: '关于 | 右灵',
        text: htmarkedHTMLml,
    })
})

//友链路由
router.get('/link', async (ctx, next) => {
    //读取文章字符串
    let html = fs.readFileSync(path.join(__dirname, `./link/link.md`), 'utf-8');

    //md转换html
    let htmarkedHTMLml = marked(html);

    //填充值模板返回
    await ctx.render('article', {
        title: '友链 | 右灵',
        text: htmarkedHTMLml,
    })
})

//应用路由
app.use(router.routes()).use(router.allowedMethods())

//开始监听
app.listen(3000, '0.0.0.0', () => {
    console.log('Koa starting at 3000.')
});
