import Router from 'koa-router';

const indexRouter = new Router();

indexRouter.get('/', async (ctx, next) => {
  await ctx.render('index.html');
});

export default indexRouter;
