@ECHO off
cd C:\Program Files\Mail Enable\Logging\SMTP

FOR /F "TOKENS=1 eol=/ DELIMS=/ " %%A IN ('DATE/T') DO SET oo=%%A
FOR /F "TOKENS=1,2 eol=/ DELIMS=/ " %%A IN ('DATE/T') DO SET mm=%%B
FOR /F "TOKENS=1,2,3 eol=/ DELIMS=/ " %%A IN ('DATE/T') DO SET dd=%%C
FOR /F "TOKENS=1,2,3,4 eol=/ DELIMS=/ " %%A IN ('DATE/T') DO SET yyyy=%%D

REM reduce year by 2000
SET /A yy=%yyyy%-2000;

REM reduce month by 1
SET /A mm=%mm%-1

REM if 0, then add 1
IF %mm% == 0 SET /A mm=%mm%+1

REM prefixes month with leading zero
IF %mm% LSS 10 SET "mm=0%mm%"

REM remove activity and debug
FOR /R %%G IN ("SMTP-Activity-%yy%%mm%*") DO DEL "%%~G"
FOR /R %%H IN ("SMTP-Debug-%yy%%mm%*") DO DEL "%%~H"

cd C:\Documents and Settings\Administrator\Desktop

@ECHO ON
