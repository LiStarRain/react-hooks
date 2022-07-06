const { src, dest, series } = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');
const del = require('del');

// 清除文件
async function clean() {
  await del('lib/**/*');
  await del('es/**/*');
}

// 将ts编译转换为cjs
function cjs() {
  // 合并配置文件
  const tsProject = ts.createProject('tsconfig.json', { module: 'CommonJS' });

  // 将ts编译为js，并使用babel向下兼容
  return tsProject
    .src()
    .pipe(tsProject())
    .pipe(babel({ configFile: './.babelrc' }))
    .pipe(uglify())
    .pipe(dest('lib/'));
}

// 将ts编译为es
function es() {
  // 合并配置信息
  const tsProject = ts.createProject('tsconfig.json', { module: 'ESNext' });

  return tsProject
    .src()
    .pipe(tsProject())
    .pipe(babel({ configFile: './.babelrc' }))
    .pipe(uglify())
    .pipe(dest('es/'));
}

// 编译声明文件，并将声明文件放入lib和es目录中
function declaration() {
  // 合并配置文件，只生成相应的声明文件
  const tsProject = ts.createProject('tsconfig.json', { declaration: true, emitDeclarationOnly: true });

  return tsProject.src().pipe(tsProject()).pipe(dest('es/')).pipe(dest('lib/'));
}

// 导出任务
exports.clean = clean;
exports.cjs = cjs;
exports.es = es;
exports.declaration = declaration;

// 导出默认任务，线性执行任务
exports.default = series(clean, cjs, es, declaration);
