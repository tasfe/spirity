<?php
// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * 使用 PHP 加载“延时”图片
 *
 * @author  i.feelinglucky@gmail.com
 * @link    http://www.gracecode.com/
 * @version $Id: slow_image.php 40 2008-09-19 03:21:33Z i.feelinglucky $
 */

sleep(2);
header('Content-type: image/png');
imagepng(imagecreatefromjpeg(''));
