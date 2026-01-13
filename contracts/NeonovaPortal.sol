// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NeonovaPortal {
    mapping(address => uint256) public userLuck;
    uint256 public constant MAX_LUCK = 100;

    event SummonResult(address indexed user, string grade, uint256 tokenId);

    function summon(uint256 amount) external {
        // 1. จ่าย Gem (เพชรสีฟ้า)
        // 2. สุ่มผลลัพธ์
        // 3. ถ้าดวงไม่ดี เพิ่มค่า Luck +1 ต่อการสุ่ม 1 ครั้ง
        // 4. ถ้า Luck == 100 บังคับดรอป Grade R ทันที
        // 5. เมื่อได้ Grade R ให้ Reset Luck เป็น 0
    }
}
