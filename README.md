# combobAx

> Form 데이터를 받을 수 있는 가벼운 jQuery 커스텀 콤보박스 플러그인

- Current version: 0.1.3

## 데모

<a target="_blank" href="http://www.choigyumin.com/_view/combobAx/">http:&#47;&#47;www.choigyumin.com/_view/combobAx/</a>

## 다운로드

> jQuery 1.4+를 필요로 합니다.

<a target="_blank" href="https://github.com/choi4450/combobAx/tree/master/dist">https:&#47;&#47;github.com/choi4450/combobAx/tree/master/dist</a>

## 기능

- &lt;select&gt;엘리먼트를 쉽게 디자인을 커스터마이징할 수 있는 HTML 구조로 변경
- 콤보박스를 &lt;input type="radio"&gt;엘리먼트로 표현함으로써 웹접근성 준수 (&lt;input type="radio"&gt;엘리먼트의 접근성을 해치지 않는 선에서 기존의 콤보박스와 유사한 키보드 접근성 제공)
- form 컨트롤 가능

## 사용 방법

### Handler

#### HTML

> data-combobax 애트리뷰트 사용

```html
<select class="example" id="f-cbo" name="example" title="Example" aria-label="Example" style="width:250px" data-combobax="label: '다른 옵션 선택'">
    <option value="A">Option A</option>
    <option value="B">Option B</option>
    <option value="C" disabled>Option C</option>
</select>
```

#### JavaScript

```js
$('.example').each(function() {
    $(this).combobAx({
        label: '다른 옵션 선택'
    });
});

// or
$('.example').combobAx({
    label: '다른 옵션 선택'
});
```

### Initialize

```js
{
	label: 'Select another option',
	bullet: '▼', 
	animateType: 'fade',
	animateDuration: 200
}
```

#### label

콤보박스 트리거 버튼 이름(aria-label) 설정

- Type: `String`
- Default Value: `'Select another option'`

```js
{
    label: '다른 옵션 선택'
}
```

```html
<button class="combobax__trigger" type="button" aria-controls="COMBOBAX1" aria-label="다른 옵션 선택" aria-expanded="false">
	<span class="combobax__trigger-txt">Option A</span>
	<span class="combobax__trigger-bu" aria-hidden="true">▼</span>
</button>
```

#### bullet

콤보박스 트리거 버튼의 블릿 마크업

- Type: `String`
- Default Value: `'▼'`

```js
{
    bullet: '<small class="bullet-example">▼</small>'
}
```

```html
<button class="combobax__trigger" type="button" aria-controls="COMBOBAX1" aria-label="Select another option" aria-expanded="false">
	<span class="combobax__trigger-txt">Option A</span>
	<span class="combobax-btn-bu" aria-hidden="true"><small class="bullet-example">▼</small></span>
</button>
```

#### animateType

콤보박스 토글 애니메이션 타입

- Type: `String`
- Default Value: `'fade'`

> Value
> - fade
> - css (combobax--animate 클래스 추가 제공, 사용자가 직접 컨트롤)

```js
{
    label: 'fade'
}
```
##### `animateType: 'css'`

```js
// Javascript
{
    label: 'css'
}
```

```css
/* CSS */
.combobax__listbox{display:none;opacity:0;-webkit-transition:opacity .2s;transition:opacity .2s}
.combobax--expanded .combobax__listbox{display:block}
.combobax--animate .combobax__listbox{opacity:1}
```

#### animateDuration

콤보박스 토글 애니메이션 진행시간

- Type: `Number`
- Default Value: `200`

```js
{
    animateDuration: 200
}
```
