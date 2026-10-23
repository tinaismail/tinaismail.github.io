---
layout: post
title: "CyLab Forensics Challenges Writeup"
subtitle: "DiskDiskSleuth2 and Operation Orchid"
thumbnail-img: "/assets/img/forensics/DiskdisksleuthII.png"
share-img: "/assets/img/forensics/DiskdisksleuthII.png"
categories: [cybersecurity]
tags: [cybersecurity, writeup, forensics]
---

Hello fellow sleuths! Welcome to my writeup for these medium-difficulty
forensics challenge on CyLab Academy. I'm still learning forensics, but
being able to follow along with challenges that increase in difficulty
as I learn at my own pace has been very motivating.

I'm following along with the [CTF Primer](https://primer.cylabacademy.org/#_what_is_forensics) on CyLab Academy. Here's a handy reference from said primer before we dive deeper into the challenges.
![Information about disk images](/assets/img/forensics/diskimage.png){: .img-fluid .rounded .shadow-sm width="600" }

Without further ado, let's jump into the first challenge!

If you'd like to take a crack at solving it first, here's the
[challenge link](https://learn.cylabacademy.org/library/137).
I'll be waiting right here until you're done.

<div class="spoiler-gate">
  <button id="done-btn" class="done-btn" type="button">
    I'm done!
  </button>
</div>

<div id="congrats" class="spoiler-content" hidden markdown="1">

### Welcome back! Congratulations. 🎉

If you were able to solve it, that's amazing, and you should be proud
of yourself. If not, let's dive into the solution below!

(You should still be proud of yourself, though. That's kind of a
non-negotiable, sorry.)

Let's use `wget` to download the target file
`dds2-alpine.flag.img.gz`. I'm using the CyLab Academy webshell for
convenience. Note that the filepath will be different for you!

```shell
wget https://challenge-files.cylabacademy.net/library/943a8b6fb8a4a0ffa7a564da860b5a307423bf7ed6b3356c5f64764ccff8f81e/dds2-alpine.flag.img.gz
```

![Using wget to download the asset](/assets/img/forensics/wget.png){: .img-fluid .rounded .shadow-sm width="600" }

Next up, let's toss that puppy into the `/tmp` folder and check it out.

```shell
att4ni-academy@webshell:/tmp$ file dds2-alpine.flag.img.gz
dds2-alpine.flag.img.gz: gzip compressed data, was "dds2-alpine.flag.img", last modified: Wed Sep 23 02:34:12 2026, from Unix, original size modulo 2^32 134217728
```

As expected, it's a gzip-compressed file. Let's unzip it using `gunzip`.

![Unzipping the gzip file with gunzip](/assets/img/forensics/unzip&binwalk.png){: .img-fluid .rounded .shadow-sm width="600" }

So it's a Linux filesystem. Neat! Let's dig into it some more with `mmls`.

![Using mmls to analyze the disk image](/assets/img/forensics/mmls.png){: .img-fluid .rounded .shadow-sm width="600" }

Amazing! Looks like the Linux filesystem partition begins at sector 2048.
Let's use `fls` to list out the filesystem.

![Using fls to inspect the filesystem](/assets/img/forensics/fls&flag.png){: .img-fluid .rounded .shadow-sm width="600" }

That looks promising indeed. Recursively looking at each directory using
`fls` would take ages. Luckily, there's a helpful flag for that:
`-r` allows us to search directories recursively.

Piping the output to `egrep` enables us to find the inode of the target
text file, `down-at-the-bottom.txt`, specified in the challenge
description.

Now all that's left is to make sense of the output. Instead of manually
editing the output and risking deleting something important, I'm going
to use CyberChef to clean up the text.

![CyberChef GUI](/assets/img/forensics/cyberchef.png){: .img-fluid .rounded .shadow-sm width="600" }

[Here's the CyberChef recipe we need to extract the flag.](https://gchq.github.io/CyberChef/#recipe=Regular_expression('User%20defined','(?%3C%3D%5C%5C(%5C%5Cs).(?%3D%5C%5Cs%5C%5C))',true,true,false,false,false,false,'List%20matches')Find_/_Replace(%7B'option':'Regex','string':'%5C%5Cn'%7D,'',true,false,true,false)&input=CiAgIF8gICAgIF8gICAgIF8gICAgIF8gICAgIF8gICAgIF8gICAgIF8gICAgIF8gICAgIF8gICAgIF8gICAgIF8gICAgIF8gICAgIF8gIAogIC8gXCAgIC8gXCAgIC8gXCAgIC8gXCAgIC8gXCAgIC8gXCAgIC8gXCAgIC8gXCAgIC8gXCAgIC8gXCAgIC8gXCAgIC8gXCAKICggYSApICggYyApICggYSApICggZCApICggZSApICggbSApICggeyApICggeyApICggZiApICggMCApICggciApICggMyApICggbiApCiAgXF8vICAgXF8vICAgXF8vICAgXF8vICAgXF8vICAgXF8vICAgXF8vICAgXF8vICAgXF8vICAgXF8vICAgXF8vICAgXF8vICAgXF8vIAogICBfICAgICBfICAgICBfICAgICBfICAgICBfICAgICBfICAgICBfICAgICBfICAgICBfICAgICBfICAgICBfICAgICBfICAgIF8gCiAgLyBcICAvIFwgICAvIFwgICAvIFwgICAvIFwgICAvIFwgICAvIFwgICAvIFwgICAvIFwgICAvIFwgICAvIFwgICAvIFwgICAvIFwgCiAoIHMgKSAoIDEgKSAoIGMgKSAoIDQgKSAoIHQgKSAoIDAgKSAoIHIgKSAoIF8gKSAoIG4gKSAoIDAgKSAoIHYgKSAoIDEgKSAoIGMgKQogIFxfLyAgIFxfLyAgIFxfLyAgIFxfLyAgIFxfLyAgIFxfLyAgIFxfLyAgIFxfLyAgIFxfLyAgIFxfLyAgIFxfLyAgIFxfLyAgIFxfLyAKICAgXyAgICAgXyAgICAgXyAgICAgXyAgICAgXyAgICAgXyAgICAgXyAgICAgXyAgICAgXyAgICAgXyAgICAgXyAgCiAgLyBcICAgLyBcICAgLyBcICAgLyBcICAgLyBcICAgLyBcICAgLyBcICAgLyBcICAgLyBcICAgLyBcICAgLyBcIAogKCAzICkgKCBfICkgKCA5ICkgKCA1ICkgKCBjICkgKCA2ICkgKCA0ICkgKCA1ICkgKCBhICkgKCBkICkgKCB9ICkKICBcXy8gICBcXy8gICBcXy8gICBcXy8gICBcXy8gICBcXy8gICBcXy8gICBcXy8gICBcXy8gICBcXy8gICBcXy8g)

I have to confess that the first time I solved this, I wasn't clever
enough to use the regular expression operation. I just used the
Find / Replace operation for each ASCII-art character.

It kind of worked, except that all the intentional underscores were
removed in the process. Later, I refreshed my knowledge of regex,
hence the CyberChef recipe above.

So there we have it! The flag is:

`academy{f0r3ns1c4t0r_n0v1c3_95c645ad}`

for those of you keeping track at home.

---

Next up, let's try [this challenge](https://learn.cylabacademy.org/library/285)!

As before, I'll give you the opportunity to solve it first before I
jump into the solution. I'll wait riiiight here.

<div class="spoiler-gate">
  <button id="done-btn-2" class="done-btn" type="button">
    I'm done! Show me the next solution
  </button>
</div>

<div id="solution-2" class="spoiler-content" hidden markdown="1">

## Operation Orchid: The Next Challenge

We get a compressed disk image. Let's get that copied into the `/tmp`
folder of the webshell and check it out.

Note that the download path may be different for you.

```shell
wget https://challenge-files.cylabacademy.net/library/c43b9c25ad2c97fb0c7c393a7b5f95065b79c0faf5848e1eeb6a453ec3e78f7d/disk.flag.img.gz
```

Here's what the download looks like in the webshell:

```shell
att4ni-academy@webshell:/tmp$ wget https://challenge-files.cylabacademy.net/library/c43b9c25ad2c97fb0c7c393a7b5f95065b79c0faf5848e1eeb6a453ec3e78f7d/disk.flag.img.gz
--2026-10-23 05:50:04--  https://challenge-files.cylabacademy.net/library/c43b9c25ad2c97fb0c7c393a7b5f95065b79c0faf5848e1eeb6a453ec3e78f7d/disk.flag.img.gz
Resolving challenge-files.cylabacademy.net (challenge-files.cylabacademy.net)... 3.160.5.95, 3.160.5.18, 3.160.5.64, ...
Connecting to challenge-files.cylabacademy.net (challenge-files.cylabacademy.net)|3.160.5.95|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 44360922 (42M) [application/octet-stream]
Saving to: 'disk.flag.img.gz'

disk.flag.img.gz 100%[======================================>] 42.31M 1.82MB/s in 23s

2026-10-23 05:50:28 (1.82 MB/s) - 'disk.flag.img.gz' saved [44360922/44360922]
```

After unzipping and running `mmls`, we can confirm our suspicion that
this is indeed a partitioned disk containing several Linux partitions.
Let's dig into each one.

```shell
att4ni-academy@webshell:/tmp$ gunzip disk.flag.img.gz
att4ni-academy@webshell:/tmp$ mmls disk.flag.img
DOS Partition Table
Offset Sector: 0
Units are in 512-byte sectors

      Slot      Start        End          Length       Description
000:  Meta      0000000000   0000000000   0000000001   Primary Table (#0)
001:  -------   0000000000   0000002047   0000002048   Unallocated
002:  000:000   0000002048   0000206847   0000204800   Linux (0x83)
003:  000:001   0000206848   0000411647   0000204800   Linux Swap / Solaris x86 (0x82)
004:  000:002   0000411648   0000819199   0000407552   Linux (0x83)
```

We can see two Linux partitions and one swap partition. The third
partition starts at sector `411648`, so we'll use that as the offset
for our next commands.

Let's search recursively for text files:

```shell
att4ni-academy@webshell:/tmp$ fls -o 411648 -r disk.flag.img | egrep '\.txt'
+ r/r * 1876(realloc): flag.txt
+ r/r 1782: flag.txt.enc
```

Looks like the original `flag.txt` file's metadata indicates that its
space was reallocated, suggesting that the file was deleted. In its
place, we have `flag.txt.enc`. Let's check that out.

```shell
att4ni-academy@webshell:/tmp$ icat -o 411648 disk.flag.img 1782 > flag.txt.enc
att4ni-academy@webshell:/tmp$ cat flag.txt.enc
Salted__v S>!jfo(s:KrـdI/Uq+fȤ7 ؎$'%
```

It's salted. This might be tough to crack. I wonder if there's any
indication of how this file was encrypted to begin with.

Since it's a Linux filesystem, the shell history file might still be
intact. Let's follow that lead.

```shell
att4ni-academy@webshell:/tmp$ fls -o 411648 -r disk.flag.img | egrep 'history'
+ r/r 1875: .ash_history

att4ni-academy@webshell:/tmp$ icat -o 411648 -r disk.flag.img 1875
touch flag.txt
nano flag.txt
apk get nano
apk --help
apk add nano
nano flag.txt
openssl
openssl aes256 -salt -in flag.txt -out flag.txt.enc -k unbreakablepassword1234567
shred -u flag.txt
ls -al
halt
```

There absolutely was a history file, and it tells us everything we need
to know about how the file was encrypted!

We have the encryption command, including the password. Let's reverse
the process using OpenSSL's `-d` flag.

```shell
att4ni-academy@webshell:/tmp$ openssl aes256 -d -salt -in flag.txt.enc -out flag.txt -k unbreakablepassword1234567
*** WARNING : deprecated key derivation used.
Using -iter or -pbkdf2 would be better.
bad decrypt
4027B1FFB4730000:error:1C800064:Provider routines:ossl_cipher_unpadblock:bad decrypt:../providers/implementations/ciphers/ciphercommon_block.c:124:

att4ni-academy@webshell:/tmp$ cat flag.txt
academy{h4un71ng_p457_0cf3a06d}
```

We got a warning and a `bad decrypt` error, but the recovered file
contains the expected flag. The warning concerns the legacy key
derivation method used by the original encryption command. The
`bad decrypt` message is not something to ignore blindly; in this
case, the output is what confirms that we recovered the intended
plaintext.

Here's the flag: academy{h4un71ng_p457_0cf3a06d}

---

It was really fun being able to jump into a couple of forensics
challenges. Thank you for joining me!

Until next time,

- Att4ni

</div>

<style>
  .done-btn {
    display: inline-block;
    background: #6c63ff;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 18px;
    font-size: 1rem;
    line-height: 1.5;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;
  }

  .done-btn:hover {
    background: #574fe0;
    transform: translateY(-2px);
  }

  .done-btn:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 4px;
  }

  .done-btn:disabled {
    cursor: default;
    opacity: 0.8;
  }

  .spoiler-gate {
    margin: 1.5rem 0;
  }

  .spoiler-content {
    margin-top: 1.5rem;
  }

  .spoiler-content[hidden] {
    display: none !important;
  }

  .spoiler-content h3 {
    animation: reveal 0.5s ease-out both;
  }

  .confetti {
    position: fixed;
    top: -12px;
    width: 8px;
    height: 12px;
    pointer-events: none;
    z-index: 99999;
    animation: confetti-fall 1.6s ease-in forwards;
  }

  @keyframes reveal {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes confetti-fall {
    to {
      transform: translate(var(--drift), 105vh) rotate(720deg);
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .done-btn {
      transition: none;
    }

    .spoiler-content h3 {
      animation: none;
    }

    .confetti {
      display: none;
    }
  }
</style>

<script>
(function () {
  function initSpoilerGate(buttonId, contentId, successText) {
    const button = document.getElementById(buttonId);
    const content = document.getElementById(contentId);

    if (!button || !content || button.dataset.initialized === 'true') {
      return;
    }

    button.dataset.initialized = 'true';

    button.addEventListener('click', function () {
      button.disabled = true;
      button.textContent = successText;

      // Respect the reader's reduced-motion preference.
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (!reduceMotion) {
        const colors = [
          '#6c63ff',
          '#ff6584',
          '#ffc857',
          '#43c6ac',
          '#ff914d'
        ];

        for (let i = 0; i < 65; i++) {
          const piece = document.createElement('span');

          piece.className = 'confetti';
          piece.setAttribute('aria-hidden', 'true');
          piece.style.left = Math.random() * 100 + 'vw';
          piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
          piece.style.setProperty(
            '--drift',
            (Math.random() * 200 - 100) + 'px'
          );
          piece.style.animationDelay = Math.random() * 0.35 + 's';

          document.body.appendChild(piece);

          piece.addEventListener('animationend', function () {
            piece.remove();
          }, { once: true });
        }
      }

      // Reveal the solution after the confetti begins.
      window.setTimeout(function () {
        content.hidden = false;
        button.closest('.spoiler-gate').hidden = true;
      }, reduceMotion ? 0 : 500);
    });
  }

  function init() {
    initSpoilerGate(
      'done-btn',
      'congrats',
      'Well done! 🎉'
    );

    initSpoilerGate(
      'done-btn-2',
      'solution-2',
      'Well done! 🎉'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
</script>