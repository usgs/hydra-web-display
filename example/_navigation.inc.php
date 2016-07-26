<?php

echo navItem('/example.php', 'Examples');

print navGroup('magnitude',
  navItem('EventSummaryViewExample.php', EventSummaryView)
);

?>
