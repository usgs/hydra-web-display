hydra-web-display
=================

Display information from Hydra software in a web interface.


Using the Generated Project
---------------------------

## Getting Started
- run `npm install` to install application development dependencies
- configure the application
- run `grunt` from the install directory

## Configuration
- run `src/lib/pre-install` to setup config.ini
- configuration options are defined in `src/lib/configure.inc.php`
- `MOUNT_PATH` is the base url for the application

## CSS
- SCSS files (`*.scss`, `!_*.scss`) in the `src/htdocs/css` directory are compiled.

- Path is configured in `gruntconfig/config.js`:
```
cssPath: [
  'src/htdocs/css',
  'node_modules/hazdev-webutils/src'
]
```

## JS
- JS files (`*.js`) in the `src/htdocs/js` directory are compiled.

- Path is configured in `gruntconfig/config.js`:
```
jsPath: {
  // DIRECTORY: EXPORT_PATTERN,

  # export all files in these directories in htdocs/js/bundle.js
  # for use in testing
  'src/htdocs/js': '*/*.js',
  'node_modules/hazdev-webutils/src': '**/*.js',

  # add to path, but don't export
  'node_modules/other-module/dist': null
}
```

## Docker

### Building an image

- From root of project, run:
    ```
    docker build -t usgs/hydra-web-display:latest .
    ```

### Running a container

- Start the container using the image tag
    ```
    docker run --name hydra-web-display -d -p 8000:8000 usgs/hydra-web-display:latest
    ```

- Configure started container

    - Connect to running container on terminal
    ```
    docker exec -it hydra-web-display /bin/bash
    ```

    - Run pre-install to configure application
    ```
    src/lib/pre-install
    ```

    - Exit the container
    ```
    exit
    ```

- Restart the container to load the updated configuration
  ```
  docker stop hydra-web-display
  docker start hydra-web-display
  ```

- Connect to running container in browser
  ```
  http://localhost:8000/ws/hydra/
  ```
