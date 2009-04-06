<?php
// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * Motion Homepage
 *
 * @author mingcheng<i.feelinglucky@gmail.com>
 * @date   2009-04-05
 * @link   http://www.gracecode.com/
 */

$include_file = 'index.shtml';
$request_base = '/motion/';
$site_uri = 'http://127.0.0.1/motion/';

$request_include_file = substr($_SERVER['REQUEST_URI'], strlen($request_base));

if(file_exists('./'.$request_include_file) && is_file($request_include_file)) {
    $include_file = './'.$request_include_file;
}

if (!strstr($include_file, '.shtml')) {
    header('Location: '. $site_uri);
    exit;
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Motion - 小型高效的 Javascript 动画组件</title>
        <style type="text/css">@import url(<?php echo $site_uri ?>/css/motion.css); </style>
        <script type="text/javascript" src="<?php echo $site_uri ?>/motion.js"></script>
    </head>
    <body>
        <div class="main-wrap">
<?php
    echo file_get_contents($include_file);
?>
            <div class="foot">
                <small>$Id$</small>
                <br />
                <a href="http://www.gracecode.com/">Gracecode.com</a>
            </div>
        </div>
    </body>
</html>
