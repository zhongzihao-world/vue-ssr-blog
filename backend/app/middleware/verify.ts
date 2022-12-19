module.exports = () => {
  return async (ctx, next) => {
    // console.log(ctx.path);
    if (ctx.path.startsWith('/api/user/login') || ctx.path.startsWith('/api/user/sendCode') || ctx.path.startsWith('/api/user/register')) {
      return await next();
    }
    try {
      const acess_token: string = ctx.request.header.acess_token;
      if (!acess_token) {
        throw '请登录';
      } else {
        await ctx.service.user.checkToken(acess_token);
        return await next();
      }
    } catch (e) {
      console.log(e);
      ctx.body = {
        ret: 304,
        content: `${e}`,
      };
    }
  };
};
