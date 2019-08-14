import Router from 'koa-router';
import config from '../config';

const indexRouter = new Router();

indexRouter.get('/', async (ctx, next) => {
  await ctx.render('index.html', {
    title: `学生课程管理 - ${config.productName}`,
    head_title: '学生课程管理',
    active: {
      student_course: true
    }
  });
});

indexRouter.get('/grade', async (ctx, next) => {
  await ctx.render('grade/index.html', {
    head_title: '成绩管理',
    active: {
      grade: true
    }
  });
});

indexRouter.get('/assess', async (ctx, next) => {
  await ctx.render('assess/index.html', {
    active: {
      statistic: true
    }
  });
});

export default indexRouter;
