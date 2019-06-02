<?php
$output = ob_get_contents();
ob_end_clean();

#$output = str_replace('http://localhost:4001/', 'https://lab.npeu.ox.ac.uk/mockup/', $output);
#$output = str_replace('href="/',        'href="/mockup/', $output);
#$output = str_replace('<script src="/', '<script src="/mockup/', $output);
#$output = str_replace('/downloads',     '/mockup/downloads', $output);
#$output = str_replace('/img',           '/mockup/img', $output);
#$output = str_replace('data="/',        'data="/mockup/', $output);
#$output = str_replace('name="msapplication-config" content="/', 'name="msapplication-config" content="/mockup/', $output);

echo $output;
?>