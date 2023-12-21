---
cards-deck: Inline
---

# Inline
#todo The **Inline deck** must contain **5 cards** defined in the section [[#Must work ✔️]].

## Must work ✔️

Example 1 is a valid::Inline card

Example 2 is a valid :: inline card

Example 3 is a valid:: inline card

Example 4 is a valid ::inline card

Example 5 is a valid:::inline reversed card

## Must NOT work ❌

### Code blocks
```java
System.out.println("Hey this is not :: a valid inline card");
```

### Inline code blocks
This is not `a valid :: inline card`

### Math blocks
This is not a good inline card. $$3::4$$

## Math inline blocks
This is not a good inline $3::4$ card.