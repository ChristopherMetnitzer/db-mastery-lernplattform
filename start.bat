@echo off
REM DB Mastery - Starter fuer Windows
REM Startet einen lokalen Webserver und oeffnet die Lernplattform im Browser.
REM (Noetig, weil die App ihre Inhalte per fetch() laedt - file:// wird vom Browser blockiert.)

cd /d "%~dp0"
set PORT=8765
set URL=http://localhost:%PORT%/index.html

REM Python finden
where python >nul 2>nul
if %ERRORLEVEL%==0 (
    set PY=python
) else (
    where py >nul 2>nul
    if %ERRORLEVEL%==0 (
        set PY=py
    ) else (
        echo FEHLER: Python ist nicht installiert. Bitte Python 3 installieren: https://www.python.org/downloads/
        echo Beim Setup "Add Python to PATH" anhaken.
        pause
        exit /b 1
    )
)

echo Starte DB Mastery auf %URL%
echo Zum Beenden: dieses Fenster schliessen oder Strg+C druecken.

REM Browser nach kurzer Verzoegerung oeffnen
start "" cmd /c "timeout /t 1 >nul & start %URL%"

REM Server im Vordergrund
%PY% -m http.server %PORT%
pause
