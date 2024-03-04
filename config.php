<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true)
{
    die();
}

return [
    'js' => [
        './dist/assets/app.js',
    ],
    'css' => [
      './dist/assets/app.css',
    ],
    'rel' => [
        'main.core',
        'ui.mustache'
    ]
];
