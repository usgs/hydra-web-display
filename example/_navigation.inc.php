<?php

echo navItem('/example.php', 'Examples');

print navGroup('Event',
    navItem('/EventSummaryViewExample.php', 'EventSummaryView')
  );

print navGroup('Magnitude',
    navItem('/MagnitudeCollectionTableExample.php',
        'MagnitudeCollectionTable') .
    navItem('/MagnitudeSummaryViewExample.php',
        'MagnitudeSummaryView') .
    navItem('MagnitudeTabViewExample.php', 'MagnitudeTabView')
  );

?>
