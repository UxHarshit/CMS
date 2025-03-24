@echo off
echo Starting
for %%i in (src\components\ui\*.tsx) do (
  echo Processing: %%~ni
  npx shadcn@latest add %%~ni --overwrite
)
echo completed.