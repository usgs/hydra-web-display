<!DOCTYPE html>
<html>
<head>
  <?php include_once '../conf/config.inc.php'; ?>
  <title>Hydra Event Search</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>

  <link rel="stylesheet" href="/theme/site/earthquake/index.css"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons|Merriweather:400,400italic,700|Source+Sans+Pro:400,300,700"/>
  <link rel="stylesheet" href="css/index.css"/>

  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="format-detection" content="address=no"/>
  <meta name="format-detection" content="telephone=no"/>
</head>
<body>
  <main id="event-search-view"></main>
  <script>
    var MOUNT_PATH = '<?php print $CONFIG['MOUNT_PATH']; ?>';
    var SERVICE_URL = '<?php print $CONFIG['SERVICE_URL']; ?>';
  </script>
  <script src="js/index.js"></script>
</body>
</html>
