import { useState, useEffect, useRef } from 'react';
import p5 from 'p5';

// 定义 p5.js 类和全局变量的类型，以便在组件内使用
interface Particle {
    x: number; y: number; oldx: number; oldy: number; char: string; pinned: boolean; isEdge: boolean; groundLevel: number;
    applyForce(fx: number, fy: number): void;
    update(): void;
    display(): void;
}

interface Spring {
    p1: Particle; p2: Particle; restLength: number; stiffness: number; currentDist: number;
    update(): void;
    display(): void;
}

export default function RemnantSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null); 
    const p5InstanceRef = useRef<p5 | null>(null);
    const interactionContainerRef = useRef<HTMLDivElement>(null);

    // Intersection Observer (保持不变)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.2 }
        );

        const section = document.getElementById('remnant');
        if (section) {
            observer.observe(section);
        }

        return () => {
            if (section) {
                observer.unobserve(section);
            }
        };
    }, []);

    // **【改动 1】将 p5.js 逻辑提取为 createSketch 函数，使其可重复调用**
    const createSketch = (p: p5) => {
        // --- 核心变量和配置 ---
        let particles: Particle[] = [];
        let springs: Spring[] = [];
        
        const txt = "Disapper";
        let cols = 70;   
        let rows = 50;   
        let spacing = 8; 

        // --- 物理参数 ---
        const STIFFNESS = 0.08;       
        const UNPIN_THRESHOLD = 2.0;  
        const DAMPING = 1;         

        // --- 随机断裂参数 ---
        const MAX_BREAK_PROBABILITY = 0.0002; 
        const MOUSE_INFLUENCE_RADIUS = 250;   

        let draggedParticle: Particle | null = null; 
        let noiseOffset = 0; 

        // --- 类定义 ---
        class Particle {
            x: number; y: number; oldx: number; oldy: number; char: string; pinned: boolean; isEdge: boolean; groundLevel: number;
            constructor(x: number, y: number, char: string) {
                this.x = x; this.y = y; 
                this.oldx = x; this.oldy = y;
                this.char = char;
                this.pinned = true;   
                this.isEdge = false;
                this.groundLevel = p.height + 200; 
            }
            applyForce(fx: number, fy: number) { this.x += fx; this.y += fy; }
            update() {
                let vx = (this.x - this.oldx) * DAMPING;
                let vy = (this.y - this.oldy) * DAMPING;
                this.oldx = this.x; this.oldy = this.y;
                this.x += vx; this.y += vy;
                if (this.y > p.height) { this.y = p.height; }
            }
            display() {
                if (this.x < -100 || this.x > p.width + 100 || this.y < -100 || this.y > p.height + 100) return;
                p.push();
                p.translate(this.x, this.y);
                p.noStroke();
                if (this.isEdge) { p.fill(180); p.textStyle(p.BOLD); } 
                else {
                    let speed = p.dist(this.x, this.y, this.oldx, this.oldy);
                    let darkness = p.map(speed, 0, 5, 200, 0); 
                    if (!this.pinned) darkness = 50; 
                    p.fill(darkness); p.textStyle(p.NORMAL);
                }
                p.text(this.char, 0, 0);
                p.pop();
            }
        }

        class Spring {
            p1: Particle; p2: Particle; restLength: number; stiffness: number; currentDist: number;
            constructor(p1: Particle, p2: Particle, length: number) {
                this.p1 = p1; this.p2 = p2;
                this.restLength = length;
                this.stiffness = STIFFNESS;
                this.currentDist = length;
            }
            update() {
                let dx = this.p2.x - this.p1.x;
                let dy = this.p2.y - this.p1.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                this.currentDist = distance;
                if (distance < 0.1) distance = 0.1;

                let difference = (this.restLength - distance) / distance;
                let offsetX = dx * difference * 0.5 * this.stiffness;
                let offsetY = dy * difference * 0.5 * this.stiffness;

                if (!this.p1.pinned && this.p1 !== draggedParticle) { this.p1.x -= offsetX; this.p1.y -= offsetY; }
                if (!this.p2.pinned && this.p2 !== draggedParticle) { this.p2.x += offsetX; this.p2.y += offsetY; }
            }
            display() {
                let stretchRatio = this.currentDist / this.restLength;
                if (stretchRatio > 1.2) {
                    let alpha = p.map(stretchRatio, 1.2, 10.0, 200, 0); 
                    alpha = p.constrain(alpha, 0, 200);
                    let weight = p.map(stretchRatio, 1.2, 10.0, 0.8, 0.05);
                    weight = p.constrain(weight, 0.05, 0.8);
                    let jitterScale = p.map(stretchRatio, 2.0, 8.0, 0, 1.5); 
                    jitterScale = p.constrain(jitterScale, 0, 1.5);
                    let jitterX = p.random(-jitterScale, jitterScale);
                    let jitterY = p.random(-jitterScale, jitterScale); 

                    p.stroke(50, alpha); 
                    p.strokeWeight(weight);
                    p.push();
                    p.translate(jitterX, jitterY);
                    p.line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
                    p.pop();
                }
            }
        }
        
        // --- 核心函数：initGrid 负责重置动画状态 ---

        function initGrid() {
            // **重置状态**：清空粒子和弹簧数组
            particles = []; 
            springs = [];
            
            let startX = (p.width - cols * spacing) / 2;
            let startY = (p.height - rows * spacing) / 2 - 30;
            
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    let charIndex = (y * cols + x) % txt.length;
                    let px = startX + x * spacing;
                    let py = startY + y * spacing;
                    
                    let particle = new Particle(px, py, txt[charIndex]);
                    
                    if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
                        particle.pinned = true;
                        particle.isEdge = true; 
                    } else {
                        particle.pinned = true; 
                        particle.isEdge = false;
                    }

                    particles.push(particle);
                }
            }
            
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    let i = y * cols + x;
                    if (x < cols - 1) springs.push(new Spring(particles[i], particles[i + 1], spacing));
                    if (y < rows - 1) springs.push(new Spring(particles[i], particles[i + cols], spacing));
                }
            }
            
            // 重置拖拽粒子和噪声偏移
            draggedParticle = null; 
            noiseOffset = 0;
        }

        function updateParticles() {
            for (let particle of particles) {
                if (particle.pinned || particle === draggedParticle) continue;
                particle.applyForce(0, 0.04); 
                let windForce = (p.noise(particle.x * 0.01, particle.y * 0.01, noiseOffset) - 0.5) * 0.2;
                particle.applyForce(windForce, 0);
                particle.update();
            }
        }

        function updateSprings() {
            for (let i = springs.length - 1; i >= 0; i--) {
                let s = springs[i];
                s.update();
                
                if (s.currentDist > s.restLength * UNPIN_THRESHOLD) {
                    if (p.random(1) < 0.2) { 
                        if (!s.p1.pinned && s.p2.pinned && !s.p2.isEdge) s.p2.pinned = false;
                        if (!s.p2.pinned && s.p1.pinned && !s.p1.isEdge) s.p1.pinned = false;
                        
                        if (draggedParticle && (s.p1 === draggedParticle || s.p2 === draggedParticle)) {
                            if (s.p1.pinned && !s.p1.isEdge) s.p1.pinned = false;
                            if (s.p2.pinned && !s.p2.isEdge) s.p2.pinned = false;
                        }
                    }
                }
                
                let isConnectedToDragged = (s.p1 === draggedParticle || s.p2 === draggedParticle);
                if (isConnectedToDragged) continue;
                
                let center_x = (s.p1.x + s.p2.x) / 2;
                let center_y = (s.p1.y + s.p2.y) / 2;
                let d = p.dist(center_x, center_y, p.mouseX, p.mouseY);
                
                let breakProbRatio = p.map(d, 0, MOUSE_INFLUENCE_RADIUS, 0, 1);
                breakProbRatio = p.constrain(breakProbRatio, 0, 1);
                breakProbRatio = Math.pow(breakProbRatio, 2); 
                
                let breakProb = MAX_BREAK_PROBABILITY * breakProbRatio;

                if (p.random(1) < breakProb) {
                    springs.splice(i, 1); 
                }
            }
        }

        function drawFrameBounds() {
            p.noFill();
            p.stroke(200); 
            p.strokeWeight(1); 
            
            let startX = (p.width - cols * spacing) / 2;
            let startY = (p.height - rows * spacing) / 2 - 30;
            let w = (cols - 1) * spacing;
            let h = (rows - 1) * spacing;
            
            p.rect(startX - 10, startY - 10, w + 20, h + 20);
        }

        // --- p5.js 生命周期函数 ---

        p.setup = () => {
            const container = interactionContainerRef.current;
            if (!container) return;
            
            // 使用 parent() 将画布附加到指定的 DOM 容器
            p.createCanvas(container.offsetWidth, 600).parent(container); 
            
            p.textFont('Courier New');
            p.textSize(7); 
            p.textAlign(p.CENTER, p.CENTER);
            
            initGrid(); // 每次 setup 时都会重置网格
        };

        p.draw = () => {
            p.clear(); 
            noiseOffset += 0.01;
            if (draggedParticle) {
                draggedParticle.x = p.mouseX;
                draggedParticle.y = p.mouseY;
                draggedParticle.pinned = false; 
                draggedParticle.x += p.random(-1, 1);
                draggedParticle.y += p.random(-1, 1);
            }
            for (let i = 0; i < 4; i++) {
                updateSprings(); 
                updateParticles();
            }
            drawFrameBounds(); 
            for (let s of springs) s.display();
            for (let particle of particles) particle.display();
        };

        p.mousePressed = () => {
            let closest: Particle | null = null;
            let minD = 60; 
            for (let particle of particles) {
                let d = p.dist(p.mouseX, p.mouseY, particle.x, particle.y);
                if (d < minD) { minD = d; closest = particle; }
            }
            if (closest && !closest.isEdge) {
                draggedParticle = closest;
                closest.pinned = false; 
            }
        };

        p.mouseReleased = () => { draggedParticle = null; };

        p.windowResized = () => {
            const container = interactionContainerRef.current;
            if (!container) return;
            p.resizeCanvas(container.offsetWidth, 600); 
            initGrid();
        };
    };

    // **【改动 2】修改 useEffect：使用 createSketch 初始化**
    useEffect(() => {
        if (!interactionContainerRef.current) return;

        // 初始创建 p5 实例
        p5InstanceRef.current = new p5(createSketch, interactionContainerRef.current);

        return () => {
            if (p5InstanceRef.current) {
                p5InstanceRef.current.remove();
            }
        };
    }, [interactionContainerRef]); 

    return (
        <section 
            id="remnant" 
            ref={sectionRef}
            className="min-h-screen bg-white py-32 px-6 relative overflow-hidden"
        >
            <div className="max-w-6xl mx-auto relative z-10">
                {/* 标题区域 - 保持不变 */}
                <div 
                    className="text-center mb-20 transition-all duration-1000"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: `translateY(${isVisible ? 0 : 60}px)`
                    }}
                >
                    <h2 
                        className="text-8xl mb-6 text-gray-900" 
                        style={{ 
                            fontFamily: 'impact, serif', 
                            fontWeight: 'bold',
                            letterSpacing: '0.04em'
                        }}
                    >
                        REMNANT TRACES
                    </h2>
                    <p 
                        className="text-lg text-gray-600 max-w-2xl mx-auto mb-12" 
                        style={{ fontFamily: 'Arial, sans-serif', lineHeight: '0.8' }}
                    >
                        The invisible weight of words: Her story in the wind
                    </p>

                    {/* 控制按钮 - **【改动 3】重置逻辑** */}
                    <div 
                        className="flex justify-center mb-12 gap-4 transition-all duration-900"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: `translateY(${isVisible ? 0 : 40}px)`,
                            transitionDelay: '400ms'
                        }}
                    >
                        <button
                            onClick={() => {
                                if (p5InstanceRef.current) {
                                    // 1. 销毁旧实例
                                    p5InstanceRef.current.remove();
                                    p5InstanceRef.current = null;
                                    
                                    // 2. 延迟后，重新创建新实例 (实现无刷新重置)
                                    setTimeout(() => {
                                        if (interactionContainerRef.current) {
                                            const newP5Instance = new p5(
                                                createSketch, // 调用可复用的函数
                                                interactionContainerRef.current
                                            );
                                            p5InstanceRef.current = newP5Instance;
                                        }
                                    }, 100);
                                }
                            }}
                            className="px-8 py-3 bg-[#3eb7a0] text-white rounded-xl hover:bg-[#3eb7a0] transition-all duration-400 cursor-pointer whitespace-nowrap hover:scale-105"
                            style={{ fontFamily: 'impact, sans-serif', fontWeight: '500',letterSpacing: '0.06em' }}
                        >
                            RESET CANVAS
                        </button>
                    </div>
                </div>

                {/* 交互画布 - 保持不变 */}
                <div 
                    ref={interactionContainerRef}
                    className="relative w-full transition-all duration-1000"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transitionDelay: '600ms',
                        height: '600px',
                        marginTop: '-100px',
                    }}
                />
            </div>
        </section>
    );
}