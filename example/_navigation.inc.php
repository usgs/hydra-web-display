<?php

echo navItem('/example.php', 'Examples');

print navGroup('Magnitude',
    navItem('/MagnitudeCollectionTableExample.php', 'Magnitude Collection Table')
  );

?>
