<?php

echo navItem('/example.php', 'Examples');

print navGroup('Magnitude',
    navItem('/MagnitudeCollectionViewExample.php', 'Magnitude Collection View')
  );

?>
