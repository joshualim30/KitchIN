//
//  CustomViews.swift
//  KitchIN
//
//  Created by Joshua Lim on 10/13/23.
//

import SwiftUI

struct LoaderView: View {
    
    @State var isLoading: Bool
    @State private var c1 = 0 // 0 = x -12, y 0
    @State private var c2 = 1 // 1 = x 12, y 0
    @State private var c3 = 2 // 2 = x 0, y 20
    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
    
    var body: some View {
        
        ZStack {
            
            VStack {
                
                ZStack {
                    
                    // C1
                    Circle()
                        .frame(width: 10, height: 10)
                        .foregroundStyle(Color("Primary").opacity(0.75))
                        .offset(x: c1 == 0 || c1 == 1 ? 6 : -6, y: c1 == 0 ? -7 : c1 == 1 ? 7 : 0)
                        .animation(.easeInOut(duration: 0.5), value: c1)
                    
                    // C2
                    Circle()
                        .frame(width: 10, height: 10)
                        .foregroundStyle(Color("Primary").opacity(0.75))
                        .offset(x: c2 == 0 || c2 == 1 ? 6 : -6, y: c2 == 0 ? -7 : c2 == 1 ? 7 : 0)
                        .animation(.easeInOut(duration: 0.5), value: c2)
                    
                    // C3
                    Circle()
                        .frame(width: 10, height: 10)
                        .foregroundStyle(Color("Primary").opacity(0.75))
                        .offset(x: c3 == 0 || c3 == 1 ? 6 : -6, y: c3 == 0 ? -7 : c3 == 1 ? 7 : 0)
                        .animation(.easeInOut(duration: 0.5), value: c3)
                    
                }
                
            }.frame(width: 60, height: 60)
                .background(Color("Foreground"))
                .cornerRadius(15)
                .shadow(radius: 3, y: 3)
                .opacity(isLoading ? 1 : 0)
                .onReceive(timer) { input in
                    
                    c1 = c1 == 2 ? 0 : c1 + 1
                    c2 = c2 == 2 ? 0 : c2 + 1
                    c3 = c3 == 2 ? 0 : c3 + 1
                    
                }
            
        }.frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(.clear) //Color("Background"))
        
    }
    
}

#Preview {
    LoaderView(isLoading: true)
}
