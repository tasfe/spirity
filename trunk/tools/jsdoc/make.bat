rem @echo off
Rem 使用 JsDoc 生成文档

Set OUT_DIR=..\..\document
Set SOURCE_DIR=..\..\source

java -jar app/js.jar app/run.js -t=templates/sweet -e=utf-8 -o=error.log -d=%OUT_DIR% -r=2 %SOURCE_DIR%

rem java -jar app\js.jar app\run.js -c=spirity.conf

cmd
