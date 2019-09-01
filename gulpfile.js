var gulp = require('gulp');
var minimist = require('minimist');
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var chached = require('gulp-cached');

var gulpsass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssmqpacker = require('css-mqpacker');
var cleancss = require('gulp-clean-css');

var imagemin = require('gulp-imagemin');
var gifsicle = require('imagemin-gifsicle');
var mozjpeg = require('imagemin-mozjpeg');
var pngquant = require('imagemin-pngquant');
var svgo = require('imagemin-svgo');

var audiosprite = require('gulp-audiosprite');

var appConfig = require('./config/app_config');
var APP_PATHS = appConfig.APP_PATHS;
var GULP_CONFIG = appConfig.GULP_CONFIG;



/**
 * [ minimistでコマンドライン引数をパース ]
 * gulp 任意のタスク --変数名 値
 * (argv[変数名]!=undefined) ? argv[変数名] : デフォルト値;
 */
var argv = minimist(process.argv.slice(2));



/* 
 * [ エラー通知 ] 
 */
function plumberWithNotify(){
  return plumber({errorHandler: notify.onError("<%= error.message %>")});
};



/**
 * SASS コンパイル
 *
 * @example
 * [development]
 * gulp kySass --env development
 *
 * [production]
 * gulp kySass --env production
 */
gulp.task('kySass', function(){
  var glob = APP_PATHS.src.sass + '/**/*.scss';
  var destDir = APP_PATHS.dest.css;
  var processors = [autoprefixer({browsers: appConfig.CSS_TARGET}), cssmqpacker];
  var isProduction = (argv['env']=='production') ? true : false;

  return gulp.src(glob)
    .pipe(plumberWithNotify())
    .pipe(gulpsass())
    .pipe(postcss(processors))
    .pipe(gulpif(isProduction, cleancss()))
    .pipe(gulp.dest(destDir));
});



/** 
 * [ IMAGE 圧縮 ]
 * mozjpegのインストールが必須となります。
 * (nodebrewを使用したインストール例)
 * brew install automake autoconf libtool dpkg pkgconfig nasm libpng
 */
gulp.task('kyImagemin-gif', function(){
  var glob = APP_PATHS.src.img + '/**/*.gif';
  var destDir = APP_PATHS.dest.img;
  
  return gulp.src(glob)
    .pipe(chached(glob))
    .pipe(plumberWithNotify())
    .pipe(imagemin([
        gifsicle({interlaced:true})
    ]))
    .pipe(gulp.dest(destDir));
});
gulp.task('kyImagemin-jpg', function(){
  var glob = APP_PATHS.src.img + '/**/*.{jpg,jpeg}';
  var destDir = APP_PATHS.dest.img;
  
  return gulp.src(glob)
    .pipe(chached(glob))
    .pipe(plumberWithNotify())
    .pipe(imagemin([
        mozjpeg({quality:GULP_CONFIG.asset.jpg, progressive: true})
    ]))
    .pipe(gulp.dest(destDir));
});
gulp.task('kyImagemin-png', function(){
  var glob = APP_PATHS.src.img + '/**/*.png';
  var destDir = APP_PATHS.dest.img;
  
  return gulp.src(glob)
    .pipe(chached(glob))
    .pipe(plumberWithNotify())
    .pipe(imagemin([
        pngquant({quality: GULP_CONFIG.asset.png, speed: GULP_CONFIG.asset.png_compress_speed})
    ]))
    .pipe(imagemin())   // ガンマ情報を除去
    .pipe(gulp.dest(destDir));
});
gulp.task('kyImagemin-svgo', function(){
  var glob = APP_PATHS.src.img + '/**/*.svg';
  var destDir = APP_PATHS.dest.img;
  
  return gulp.src(glob)
      .pipe(chached(glob))
      .pipe(plumberWithNotify())
      .pipe(imagemin([
        svgo({
          plugins: [
            GULP_CONFIG.asset.svg
          ]
        })
      ]))
      .pipe(gulp.dest(destDir));
});
gulp.task('kyImagemin', gulp.parallel('kyImagemin-gif', 'kyImagemin-jpg', 'kyImagemin-png', 'kyImagemin-svgo'));



/**
 * [ オーディオスプライトの結合 ]
 * ffmpegが必要となります。
 * (nodebrewを使用したインストール例)
 * brew install ffmpeg
 * 
 * @example howler.js
 * const HOWL_DATA = {
 *    src: ['audio.ogg', 'audio.m4a', 'audio.mp3', 'audio.ac3'],
 *    sprite: {'lightsaber': [0, 1071], 'theme': [5000, 94302, true]}
 * };
 * const howl = new Howl(HOWL_DATA);
 * 
 * HOWL_DATAの内容は書き出されるJSONのものです
 * ループする際にはspriteの該当データの第3引数をtrueにする
 */
gulp.task('kyAudioSprite', function(){
    var glob = APP_PATHS.src.audio + '/*.mp3';
    var destDir = APP_PATHS.dest.audio;
    var config = GULP_CONFIG.asset.audio;
    var bps = (argv['bitrate'] != undefined) ? argv['bitrate'] : config.bitrate;

    return gulp.src(glob)
      .pipe(plumberWithNotify())
      .pipe(audiosprite({
        // 出力ファイル名
        output: 'audio',
        
        // ビットレート
        bitrate: config.bitrate,
        
        // JSONの出力タイプ(対応形式： jukebox、howler、createjs)
        // howlerの場合、'urls'という記述を'src'に変更する必要あり。
        format: config.format,

        // 1: mono, 2: stereo
        channels: config.channel,

        // JSONに書かれるパス
        path: './audio'
      }))
      .pipe(gulp.dest(destDir));
});
