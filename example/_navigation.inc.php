<?php

echo navItem('/example.php', 'Examples');

print navGroup('Event',
    navItem('/EventSummaryViewExample.php', 'EventSummaryView')
  );

print navGroup('magnitude',
  navItem('EventSummaryViewExample.php', EventSummaryView) .
  navItem('/MagnitudeCollectionTableExample.php', 'MagnitudeCollectionTable') .
  navItem('MagnitudeTabViewExample.php', MagnitudeTabView)
);

?>
