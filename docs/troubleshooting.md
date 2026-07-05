# Troubleshooting

## Command not found
If npx cannot resolve package:
- verify package name and scope
- run npm cache verify
- retry with explicit version if needed

## Validation fails
- check harness.config.yaml exists
- check workflows file names match command
- check model-routing policy syntax

## Run command fails on workflow
- confirm workflow file exists under harness/workflows
- confirm workflow name matches argument

## Team sees drift in output style
- tighten convention gates in workflow verify phase
- add explicit output contracts
- reduce run scope per task
