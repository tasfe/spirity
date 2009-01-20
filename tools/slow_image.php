<?php
// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * 使用 PHP 加载“延时”图片
 *
 * @author  i.feelinglucky@gmail.com
 * @link    http://www.gracecode.com/
 * @version $Id$
 */

if (!isset($_GET['sleep']) || !$sleep = intval($_GET['sleep'])) {
    $sleep = 5;
}
sleep($sleep);

header('Content-type: image/png');
die(imagepng(imagecreatefromgif('sample.gif')));
