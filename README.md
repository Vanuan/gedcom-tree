GEDCOM Tree
===========

This is meant to be a library (or tool) that
implements [GEDCOM 5.5](http://homepages.rootsweb.ancestry.com/~pmcbride/gedcom/55gctoc.htm) parsing
in JavaScript.

Current status
--------------

[![browser support](https://ci.testling.com/Vanuan/gedcom-tree.png)](https://ci.testling.com/Vanuan/gedcom-tree)

Parses gedcom data from ArrayBuffer into JSON structure.

Current short term goals
------------------------

* Read and write [GEDCOM 5.5 Torture Test Files](http://www.geditcom.com/gedcom.html)
* Read familyspace.ru exported GEDCOM files


Long term goals
---------------

* Provide a user consumable GEDCOM file viewer


Motivation
----------

There are various genealogy vendors over there.

Almost all of them use the corrupt strategy "Embrace - Extend - Extinguish". Let's recall what it means:

1. Embrace. You provide a technology that is compatible with every other vendor and try to establish it as a standard.
2. Extend. Add additional non-standard features that makes it possible to consume the content created in competing products, but prevents competitors from using content created in your product.
3. Extinguish. Because of the "vendor lock-in" created by incompatibilities, more and more users switch to your product and vendors that can't keep up with pace of adding new non-standard, undocumented features become marginalized.

In genealogy sector such interoperability "standard" is GEDCOM.
GEDCOM was created by FamilySearch as a sharing format for its Personal Ancestral File software. Now, that FamilySearch has gone online, it's dropped support for both Personal Ancestral File and an ability to export your tree to GEDCOM.

Being frustrated over such GEDCOM incompatibilities, when you can't easily switch genealogy vendors, I've decided to do something about it.

For starters, you should be able to view your GEDCOM from vendors that provide export feature. Additionally, there should be a converter between various GEDCOM flavors.


